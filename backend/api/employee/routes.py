from . import employee_bp
from flask import request, jsonify
from sqlalchemy import text
from api.extensions import db

@employee_bp.route('/', methods=['GET'])
def example():
    return {"message": "Welcome"}