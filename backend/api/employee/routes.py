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
                vehicles.make || ' ' || vehicles.model AS vehicle,
                vehicles.vin,
                rentals.pickup_date,
                rentals.dropoff_date,
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

@employee_bp.route('/pickups', methods=['GET'])
def get_pickups():
    current_date = datetime.now().strftime('%Y-%m-%d')
    reservations = db.session.execute(
        text("""
            SELECT 
                rentals.*, 
                users.first_name, 
                users.last_name, 
                users.email, 
                users.phone_number 
            FROM rentals
            JOIN users ON rentals.customer_id = users.id
            WHERE pickup_date >= :date AND dropoff_date >= :date
            ORDER BY dropoff_date DESC
        """),
        {'date': current_date}
    ).fetchall()

    return jsonify([dict(row._mapping) for row in reservations]), 200

@employee_bp.route('/dropoffs', methods=['GET'])
def get_dropoffs():
    current_date = datetime.now().strftime('%Y-%m-%d')
    reservations = db.session.execute(
        text("""
            SELECT 
                rentals.*, 
                users.first_name, 
                users.last_name, 
                users.email, 
                users.phone_number 
            FROM rentals
            JOIN users ON rentals.customer_id = users.id
            WHERE pickup_date <= :date AND dropoff_date >= :date 
            ORDER BY dropoff_date DESC
        """),
        {'date': current_date}
    ).fetchall()

    return jsonify([dict(row._mapping) for row in reservations]), 200       