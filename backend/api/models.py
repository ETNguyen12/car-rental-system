from .extensions import db

class Customer(db.Model):
    __tablename__ = 'test'
    
    test_id = db.Column(db.Integer, primary_key=True)
    test_name = db.Column(db.Integer, nullable=True)