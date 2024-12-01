from .extensions import db

class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(10), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)

class CustomerDetails(db.Model):
    __tablename__ = 'customer_details'

    customer_id = db.Column(db.Integer, primary_key=True)
    birth_date = db.Column(db.Date, nullable=False)
    address_line1 = db.Column(db.String(100), nullable=False)
    address_line2 = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(10), nullable=False)
    license_number = db.Column(db.String(20), unique=True, nullable=False)
    policy_number = db.Column(db.String(20), unique=True, nullable=True)


class Vehicles(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    color = db.Column(db.String(20), nullable=False)
    type = db.Column(db.String(50), nullable=False) 
    year = db.Column(db.Integer, nullable=False)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    vin = db.Column(db.String(17), unique=True, nullable=False)
    license_plate = db.Column(db.String(20), unique=True, nullable=False) 
    fuel = db.Column(db.String(20), nullable=False) 
    seat_capacity = db.Column(db.Integer, nullable=False) 
    odometer_reading = db.Column(db.Float, nullable=False) 
    maintenance_due_date = db.Column(db.Date, nullable=True)
    daily_rental_rate = db.Column(db.Float, nullable=False)
    total_times_rented = db.Column(db.Integer, nullable=False, default=0) 
    status = db.Column(db.String(50), nullable=False, default="Available")
    created_at = db.Column(db.DateTime, nullable=False) 
    last_updated_at = db.Column(db.DateTime, nullable=False)  


class Rentals(db.Model):
    __tablename__ = 'rentals'

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, nullable=False) 
    customer_id = db.Column(db.Integer, nullable=False)  
    pickup_date = db.Column(db.Date, nullable=False) 
    dropoff_date = db.Column(db.Date, nullable=True) 
    odometer_before = db.Column(db.Float, nullable=False) 
    odometer_after = db.Column(db.Float, nullable=True)
    total_price = db.Column(db.Float, nullable=False)
    rental_paid = db.Column(db.Boolean, nullable=False, default=False)
    status = db.Column(db.String(50), nullable=False, default="Pending")
    created_at = db.Column(db.DateTime, nullable=False)
    last_updated_at = db.Column(db.DateTime, nullable=False)


class RentalFees(db.Model):
    __tablename__ = 'rental_fees'

    id = db.Column(db.Integer, primary_key=True)  
    rental_id = db.Column(db.Integer, nullable=False) 
    type = db.Column(db.String(50), nullable=False) 
    description = db.Column(db.String(200), nullable=True) 
    amount = db.Column(db.Float, nullable=False)
    fee_paid = db.Column(db.Boolean, nullable=False, default=False)  
    due_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False)
    last_updated_at = db.Column(db.DateTime, nullable=False)