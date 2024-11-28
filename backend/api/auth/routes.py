from . import auth_bp
from flask import request, jsonify
from sqlalchemy import text
from api.extensions import db

@auth_bp.route('/', methods=['GET'])
def example():
    return {"message": "Welcome"}

@auth_bp.route('/login', methods=['POST'])
def login():
    return {}