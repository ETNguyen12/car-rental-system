from flask import Flask
from flask_cors import CORS
from .config import Config
from .customer import customer_bp
from .manager import manager_bp
from .extensions import db
import os

def register_extensions(app):
    CORS(app, origins='*')  
    db.init_app(app)      

def register_blueprints(app):
    app.register_blueprint(customer_bp, url_prefix='/api/customer')
    app.register_blueprint(manager_bp, url_prefix='/api/manager')