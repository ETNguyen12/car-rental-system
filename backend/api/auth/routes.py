from . import auth_bp
from flask import request, jsonify
from sqlalchemy.exc import IntegrityError
from api.extensions import db
from api.models import Users, CustomerDetails
import requests
import os
from datetime import datetime

HASH_API_KEY = os.getenv("HASH_API_KEY")

@auth_bp.route('/', methods=['GET'])
def example():
    return {"message": "Welcome"}


@auth_bp.route('/signup', methods=['POST'])
def signup():
    if not HASH_API_KEY:
        return jsonify({"error": "Internal server error: HASH_API_KEY not configured"}), 500

    try:
        # Parse request JSON
        data = request.get_json()
        required_fields = [
            "first_name", "last_name", "email", "password", "phone_number",
            "birth_date", "address_line1", "city", "state", "zip_code", "license_number"
        ]
        print(data)
        # Validate required fields
        for field in required_fields:
            if not data.get(field):
                return jsonify({"status": "error", "message": f"{field} is required"}), 400

        # Optional fields
        address_line2 = data.get("address_line2")
        policy_number = data.get("policy_number")

        # Hash the plaintext password using the Algobook API
        hash_url = f"{HASH_API_KEY}hash"
        hash_response = requests.get(hash_url, params={"plain": data["password"]})

        if hash_response.status_code != 200:
            return jsonify({"status": "error", "message": "Error hashing password"}), 500

        hashed_password = hash_response.json().get("hashed")
        if not hashed_password:
            return jsonify({"status": "error", "message": "Failed to hash password"}), 500

        # Insert user into Users table
        user = Users(
            type="Customer",
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            hashed_password=hashed_password,
            phone_number=data["phone_number"]
        )
        db.session.add(user)
        db.session.flush()  # Ensure user ID is generated before inserting into CustomerDetails

        # Insert customer details into CustomerDetails table
        customer_details = CustomerDetails(
            customer_id=user.id,
            birth_date=datetime.strptime(data["birth_date"], "%Y-%m-%d"),
            address_line1=data["address_line1"],
            address_line2=address_line2,
            city=data["city"],
            state=data["state"],
            zip_code=data["zip_code"],
            license_number=data["license_number"],
            policy_number=policy_number
        )
        db.session.add(customer_details)
        db.session.commit()

        return jsonify({"status": "success", "message": "Signup successful", "user": {"id": user.id, "email": user.email}}), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": "User with this email, license number, or policy number already exists", "details": str(e)}), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": "An error occurred", "details": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    if not HASH_API_KEY:
        return jsonify({"error": "Internal server error: HASH_API_KEY not configured"}), 500

    try:
        # Parse JSON data from the request
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Validate input
        if not email or not password:
            return jsonify({"status": "error", "message": "Email and password are required"}), 400

        # Fetch user from the database by email
        user = db.session.query(Users).filter_by(email=email).first()

        if not user:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401

        # Validate the password hash using the Algobook API
        url = f"{HASH_API_KEY}validate"
        params = {
            "plain": password,
            "hashed": user.hashed_password
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            return jsonify({"status": "error", "message": "Error validating password"}), 500

        # Check if the hash validation is successful
        valid = response.json().get("valid", False)
        if not valid:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401

        # Successful login
        return jsonify({"status": "success", "message": "Login successful", "user": {"id": user.id, "email": user.email, "type": user.type}}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": "An error occurred", "details": str(e)}), 500