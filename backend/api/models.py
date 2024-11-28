from .extensions import db

class Customer(db.Model):
    __tablename__ = 'customer_info'
    
    customer_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    beast_points = db.Column(db.Integer, nullable=False)