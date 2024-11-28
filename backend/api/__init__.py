from flask import Flask
from flask_cors import CORS
from .config import Config
from .example import example_bp
from .extensions import db
import os

def register_extensions(app):
    CORS(app, origins='*')  
    db.init_app(app)      

def register_blueprints(app):
    app.register_blueprint(example_bp, url_prefix='/api/example')