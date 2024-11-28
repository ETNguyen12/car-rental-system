from flask import Flask
from flask_cors import CORS
from .config import Config
from .auth import auth_bp
from .customer import customer_bp
from .employee import employee_bp
from .extensions import db
import os

def register_extensions(app):
    CORS(app, origins='*')  
    db.init_app(app)      

def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(customer_bp, url_prefix='/api/customer')
    app.register_blueprint(employee_bp, url_prefix='/api/employee')