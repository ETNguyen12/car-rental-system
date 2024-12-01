from datetime import datetime, timezone
from sqlite3 import IntegrityError
from . import employee_bp
from flask import request, jsonify
from sqlalchemy import text
from api.extensions import db
from api.models import Vehicles

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

        db.session.execute(
            text("""
                UPDATE vehicles
                SET status = 'In Use'
                WHERE id IN (
                    SELECT DISTINCT vehicle_id
                    FROM rentals
                    WHERE status = 'Ongoing'
                )
            """)
        )
        
        db.session.commit()
        return jsonify({"message": "Rental and vehicle statuses updated successfully"}), 200

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


@employee_bp.route('/rentals/<int:rental_id>/confirm-payment', methods=['PUT'])
def confirm_payment(rental_id):
    try:
        query = """
            UPDATE rentals
            SET status = 'Reserved'
            WHERE id = :rental_id
            AND status = 'Unpaid'
        """
        result = db.session.execute(text(query), {"rental_id": rental_id})
        if result.rowcount == 0:
            return jsonify({"error": "Rental not found or not in Pending Payment status."}), 404
        db.session.commit()
        return jsonify({"message": "Payment confirmed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


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
        current_utc_time = datetime.now(timezone.utc)
        max_id_result = db.session.execute(text("SELECT MAX(id) AS max_id FROM rentals")).fetchone()
        next_id = (max_id_result.max_id or 0) + 1

        # Insert the new rental into the database
        db.session.execute(
            text("""
                INSERT INTO rentals (
                    id, customer_id, vehicle_id, pickup_date, dropoff_date, 
                    odometer_before, odometer_after, total_price, status, 
                    created_at, last_updated_at
                ) VALUES (
                    :id, :customer_id, :vehicle_id, :pickup_date, :dropoff_date, 
                    :odometer_before, :odometer_after, :total_price, :status, 
                    :created_at, :last_updated_at
                )
            """),
            {
                'id': next_id,
                'customer_id': data['customer_id'],
                'vehicle_id': data['vehicle_id'],
                'pickup_date': data['pickup_date'],
                'dropoff_date': data['dropoff_date'],
                'odometer_before': odometer_before,
                'odometer_after': data.get('odometer_after', None),
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

        db.session.execute(
            text("""
                UPDATE vehicles
                SET status = 'Available'
                WHERE id = (
                    SELECT vehicle_id
                    FROM rentals
                    WHERE id = :rental_id
                )
            """),
            {'rental_id': rental_id}
        )

        db.session.commit()
        return jsonify({"message": "Rental completed and vehicle status updated successfully"}), 200

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
        status = request.args.get('status')
        due_date = request.args.get('due_date')
        fee_type = request.args.get('type')

        query = """
            SELECT 
                rf.id,
                rf.rental_id,
                rf.description,
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


@employee_bp.route('/users/info', methods=['GET'])
def get_users():
    try:
        query = """
            SELECT 
                u.id,
                u.first_name || ' ' || u.last_name AS name,
                u.email,
                u.phone_number,
                cd.license_number,
                cd.policy_number,
                cd.address_line1,
                cd.address_line2,
                cd.city,
                cd.state,
                cd.zip_code,
                cd.birth_date,
                (
                    SELECT MAX(r.dropoff_date) 
                    FROM rentals r
                    WHERE r.customer_id = u.id
                ) AS last_rental
            FROM users u
            LEFT JOIN customer_details cd ON u.id = cd.customer_id
            WHERE u.role = 'Customer'
            ORDER BY u.id ASC
        """
        users = db.session.execute(text(query)).fetchall()
        return jsonify([dict(row._mapping) for row in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@employee_bp.route('/vehicles/create', methods=['POST'])
def create_vehicle():
    try:
        # Parse request JSON
        data = request.get_json()
        required_fields = [
            "color", "type", "year", "make", "model", "vin",
            "license_plate", "fuel", "seat_capacity", "odometer_reading",
            "maintenance_due_date", "daily_rental_rate", "status"
        ]

        # Validate required fields
        for field in required_fields:
            if not data.get(field):
                return jsonify({"status": "error", "message": f"{field} is required"}), 400
            
        max_id_result = db.session.execute(text("SELECT MAX(id) AS max_id FROM vehicles")).fetchone()
        next_id = (max_id_result.max_id or 0) + 1

        # Insert vehicle into the database
        vehicle = Vehicles(
            id=next_id,
            color=data["color"],
            type=data["type"],
            year=data["year"],
            make=data["make"],
            model=data["model"],
            vin=data["vin"],
            license_plate=data["license_plate"],
            fuel=data["fuel"],
            seat_capacity=data["seat_capacity"],
            odometer_reading=data["odometer_reading"],
            maintenance_due_date=data["maintenance_due_date"],
            daily_rental_rate=data["daily_rental_rate"],
            status=data["status"],
            created_at=datetime.now(),
            last_updated_at=datetime.now()
        )
        db.session.add(vehicle)
        db.session.commit()

        return jsonify({"status": "success", "message": "Vehicle created successfully", "vehicle": vehicle.id}), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": "A vehicle with this VIN or license plate already exists", "details": str(e)}), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": "An error occurred", "details": str(e)}), 500
    
    
@employee_bp.route('/rentals', methods=['GET'])
def get_rentals_by_customer():
    customer_id = request.args.get('customer_id')
    if not customer_id:
        return jsonify({"error": "customer_id is required"}), 400

    try:
        # Fetch rentals for the given customer_id
        rentals = db.session.execute(
            text("""
                SELECT 
                    r.id, 
                    v.make || ' ' || v.model AS vehicle, 
                    r.pickup_date, 
                    r.dropoff_date 
                FROM 
                    rentals r
                JOIN 
                    vehicles v ON r.vehicle_id = v.id
                WHERE 
                    r.status = 'Completed' AND
                    r.customer_id = :customer_id
            """),
            {"customer_id": customer_id}
        ).fetchall()

        # Transform results into a list of dictionaries
        rentals_list = [
            {
                "id": rental.id,
                "vehicle": rental.vehicle,
                "pickup_date": rental.pickup_date.isoformat() if rental.pickup_date else None,
                "dropoff_date": rental.dropoff_date.isoformat() if rental.dropoff_date else None,
            }
            for rental in rentals
        ]

        return jsonify(rentals_list), 200

    except Exception as e:
        return jsonify({"error": "An error occurred while fetching rentals", "details": str(e)}), 500


@employee_bp.route('/fees/create', methods=['POST'])
def create_rental_fee():
    try:
        # Parse the request data
        data = request.json
        required_fields = ['rental_id', 'type', 'description', 'amount', 'status', 'due_date']
        missing_fields = [field for field in required_fields if field not in data]

        # Validate required fields
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400
        
        max_id_result = db.session.execute(text("SELECT MAX(id) AS max_id FROM vehicles")).fetchone()
        next_id = (max_id_result.max_id or 0) + 1

        # Insert the rental fee into the database
        db.session.execute(
            text("""
                INSERT INTO rental_fees (rental_id, type, description, amount, status, due_date, created_at, last_updated_at)
                VALUES (:rental_id, :type, :description, :amount, :status, :due_date, NOW(), NOW())
            """),
            {
                'id': next_id,
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