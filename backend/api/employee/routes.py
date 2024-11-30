from datetime import datetime, timezone
from . import employee_bp
from flask import request, jsonify
from sqlalchemy import text
from api.extensions import db

@employee_bp.route('/rentals/info', methods=['GET'])
def get_rentals():
    rentals = db.session.execute(
        text("""
            SELECT 
                rentals.id AS rental_id,
                users.first_name || ' ' || users.last_name AS customer_name,
                vehicles.year || ' ' || vehicles.make || ' ' || vehicles.model AS vehicle,
                vehicles.vin,
                vehicles.color,
                vehicles.fuel,
                vehicles.daily_rental_rate,
                vehicles.seat_capacity,
                rentals.pickup_date,
                rentals.dropoff_date,
                rentals.odometer_before,
                rentals.odometer_after,
                rentals.status,
                rentals.total_price,
                users.id,
                users.email,
                users.phone_number
            FROM rentals
            JOIN users ON rentals.customer_id = users.id
            JOIN vehicles ON rentals.vehicle_id = vehicles.id
            ORDER BY rentals.pickup_date ASC
        """)
    ).fetchall()

    return jsonify([dict(row._mapping) for row in rentals]), 200 

@employee_bp.route('/rentals/update_status', methods=['PUT'])
def update_rental_status():
    try:
        current_date = datetime.now().date()
        db.session.execute(
            text("""
                UPDATE rentals
                SET status = 'Ongoing'
                WHERE status != 'Completed'
                AND pickup_date <= :current_date
                AND dropoff_date >= :current_date
            """),
            {"current_date": current_date}
        )
        db.session.commit()
        return jsonify({"message": "Rental statuses updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@employee_bp.route('/vehicles/update_odometer', methods=['PUT'])
def update_vehicle_odometer():
    try:
        # Update vehicles' odometer_reading based on the maximum odometer_after from rentals
        db.session.execute(
            text("""
                UPDATE vehicles
                SET odometer_reading = (
                    SELECT MAX(r.odometer_after)
                    FROM rentals r
                    WHERE r.vehicle_id = vehicles.id
                )
                WHERE vehicles.id IN (
                    SELECT DISTINCT vehicle_id
                    FROM rentals
                )
            """)
        )

        # Update rentals' odometer_before for ongoing rentals
        db.session.execute(
            text("""
                UPDATE rentals
                SET odometer_before = (
                    SELECT v.odometer_reading
                    FROM vehicles v
                    WHERE rentals.vehicle_id = v.id
                )
                WHERE rentals.status = 'Ongoing'
            """)
        )

        db.session.commit()
        return jsonify({"message": "Vehicle odometer values and ongoing rentals updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@employee_bp.route('/customers', methods=['GET'])
def get_customers():
    search_query = request.args.get('search', '').strip().lower()
    customers = db.session.execute(
        text("""
            SELECT 
                id,
                first_name || ' ' || last_name AS name,
                email,
                phone_number
            FROM users
            WHERE role = 'Customer'
            AND LOWER(first_name || ' ' || last_name) LIKE :search_query
        """),
        {'search_query': f'%{search_query}%'}
    ).fetchall()    

    return jsonify([dict(row._mapping) for row in customers]), 200


@employee_bp.route('/vehicles', methods=['GET'])
def get_available_vehicles():
    pickup_date = request.args.get('pickup_date')
    dropoff_date = request.args.get('dropoff_date')

    if not pickup_date or not dropoff_date:
        return jsonify({"error": "pickup_date and dropoff_date are required"}), 400

    vehicles = db.session.execute(
        text("""
            SELECT 
                vehicles.id,
                vehicles.year || ' ' || vehicles.make || ' ' || vehicles.model AS model,
                vehicles.vin,
                vehicles.daily_rental_rate
            FROM vehicles
            WHERE vehicles.id NOT IN (
                SELECT vehicle_id
                FROM rentals
                WHERE 
                    (pickup_date BETWEEN :pickup_date AND :dropoff_date)
                    OR 
                    (dropoff_date BETWEEN :pickup_date AND :dropoff_date)
            )
        """),
        {'pickup_date': pickup_date, 'dropoff_date': dropoff_date}
    ).fetchall()

    return jsonify([dict(row._mapping) for row in vehicles]), 200

@employee_bp.route('/rentals/create', methods=['POST'])
def create_new_rental():
    data = request.json

    required_fields = ['customer_id', 'vehicle_id', 'pickup_date', 'dropoff_date', 'status']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    try:
        vehicle_query = db.session.execute(
            text("SELECT odometer_reading FROM vehicles WHERE id = :vehicle_id"),
            {'vehicle_id': int(data['vehicle_id'])}
        )
        vehicle_data = vehicle_query.fetchone()

        odometer_before = vehicle_data[0]  
        print(odometer_before)
        current_utc_time = datetime.now(timezone.utc)

        # Insert the new rental into the database
        db.session.execute(
            text("""
                INSERT INTO rentals (
                    customer_id, vehicle_id, pickup_date, dropoff_date, 
                    odometer_before, odometer_after, total_price, status, 
                    created_at, last_updated_at
                ) VALUES (
                    :customer_id, :vehicle_id, :pickup_date, :dropoff_date, 
                    :odometer_before, :odometer_after, :total_price, :status, 
                    :created_at, :last_updated_at
                )
            """),
            {
                'customer_id': data['customer_id'],
                'vehicle_id': data['vehicle_id'],
                'pickup_date': data['pickup_date'],
                'dropoff_date': data['dropoff_date'],
                'odometer_before': odometer_before,
                'odometer_after': data['odometer_after'],
                'total_price': data.get('total_price', 0),
                'status': data['status'],
                'created_at': current_utc_time,
                'last_updated_at': current_utc_time,
            }
        )
        db.session.commit()

        return jsonify({"message": "Rental created successfully"}), 201

    except Exception as e:
        print(f"Database Error: {e}") 
        return jsonify({"error": "Failed to create rental", "details": str(e)}), 500
    

@employee_bp.route('/rentals/<int:rental_id>/complete', methods=['PUT'])
def complete_rental(rental_id):
    data = request.json
    if 'odometer_after' not in data:
        return jsonify({"error": "odometer_after is required"}), 400

    try:
        db.session.execute(
            text("""
                UPDATE rentals
                SET status = 'Completed', odometer_after = :odometer_after, last_updated_at = :last_updated_at
                WHERE id = :rental_id
            """),
            {
                'odometer_after': data['odometer_after'],
                'last_updated_at': datetime.now(timezone.utc),
                'rental_id': rental_id,
            }
        )
        db.session.commit()
        return jsonify({"message": "Rental completed successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to complete rental", "details": str(e)}), 500


@employee_bp.route('/rentals/<int:rental_id>', methods=['DELETE'])
def delete_rental(rental_id):
    try:
        db.session.execute(
            text("DELETE FROM rentals WHERE id = :rental_id"),
            {'rental_id': rental_id}
        )
        db.session.commit()
        return jsonify({"message": "Rental deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete rental", "details": str(e)}), 500

@employee_bp.route('/rental-fees/info', methods=['GET'])
def get_rental_fees():
    try:
        # Optional query parameters for filtering
        status = request.args.get('status')
        due_date = request.args.get('due_date')
        fee_type = request.args.get('type')

        query = """
            SELECT 
                rf.id,
                rf.rental_id,
                rf.type,
                rf.amount,
                rf.status,
                rf.due_date,
                u.first_name || ' ' || u.last_name AS name,
                u.phone_number,
                u.email
            FROM rental_fees rf
            JOIN rentals r ON rf.rental_id = r.id
            JOIN users u ON r.customer_id = u.id
        """
        conditions = []
        params = {}

        if status:
            conditions.append("rf.status = :status")
            params['status'] = status
        if due_date:
            conditions.append("rf.due_date = :due_date")
            params['due_date'] = due_date
        if fee_type:
            conditions.append("rf.type = :type")
            params['type'] = fee_type

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY rf.due_date ASC"

        result = db.session.execute(text(query), params).fetchall()

        return jsonify([dict(row._mapping) for row in result]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@employee_bp.route('/rental-fees', methods=['POST'])
def create_rental_fee():
    try:
        data = request.json
        required_fields = ['rental_id', 'type', 'description', 'amount', 'status', 'due_date']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        db.session.execute(
            text("""
                INSERT INTO rental_fees (rental_id, type, description, amount, status, due_date, created_at, last_updated_at)
                VALUES (:rental_id, :type, :description, :amount, :status, :due_date, NOW(), NOW())
            """),
            {
                'rental_id': data['rental_id'],
                'type': data['type'],
                'description': data['description'],
                'amount': data['amount'],
                'status': data['status'],
                'due_date': data['due_date']
            }
        )
        db.session.commit()

        return jsonify({"message": "Rental fee created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@employee_bp.route('/rental-fees/<int:fee_id>/status', methods=['PUT'])
def update_rental_fee_status(fee_id):
    try:
        data = request.json
        new_status = data.get('status')

        if not new_status:
            return jsonify({"error": "Missing 'status' field"}), 400

        db.session.execute(
            text("""
                UPDATE rental_fees
                SET status = :status, last_updated_at = NOW()
                WHERE id = :fee_id
            """),
            {'status': new_status, 'fee_id': fee_id}
        )
        db.session.commit()

        return jsonify({"message": "Rental fee status updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@employee_bp.route('/rental-fees/<int:fee_id>', methods=['DELETE'])
def delete_rental_fee(fee_id):
    try:
        db.session.execute(
            text("DELETE FROM rental_fees WHERE id = :fee_id"),
            {'fee_id': fee_id}
        )
        db.session.commit()

        return jsonify({"message": "Rental fee deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@employee_bp.route('/vehicles/info', methods=['GET'])
def get_vehicles():
    try:
        query = """
            SELECT 
                id,
                year || ' ' || make || ' ' || model AS model,
                type,
                vin,
                color,
                fuel,
                odometer_reading,
                daily_rental_rate,
                status
            FROM vehicles
            ORDER BY id ASC
        """
        vehicles = db.session.execute(text(query)).fetchall()
        return jsonify([dict(row._mapping) for row in vehicles]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

