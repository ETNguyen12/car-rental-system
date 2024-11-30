from datetime import datetime
from . import employee_bp
from flask import request, jsonify
from sqlalchemy import text
from api.extensions import db

@employee_bp.route('/rentals', methods=['GET'])
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


@employee_bp.route('/vehicles/update_odometer', methods=['PUT'])
def update_vehicle_odometer():
    try:
        # Perform the update query
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
        db.session.commit()
        return jsonify({"message": "Vehicle odometer values updated successfully"}), 200
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
            WHERE LOWER(first_name || ' ' || last_name) LIKE :search_query
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
        # Use timezone-aware datetimes for UTC
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
                'odometer_before': data.get('odometer_before', 0),
                'odometer_after': data.get('odometer_after'),
                'total_price': data.get('total_price', 0),
                'status': data['status'],
                'created_at': current_utc_time,
                'last_updated_at': current_utc_time,
            }
        )
        db.session.commit()

        return jsonify({"message": "Rental created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500