from . import customer_bp
from flask import request, jsonify
from sqlalchemy import text
from api.extensions import db

@customer_bp.route('/', methods=['GET'])
def example():
    return {"message": "Welcome"}