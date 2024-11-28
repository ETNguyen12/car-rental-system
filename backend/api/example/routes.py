from . import example_bp
from flask import request, jsonify
from sqlalchemy import text
from api.extensions import db

@example_bp.route('/', methods=['GET'])
def example():
    return {"message": "Welcome"}

@example_bp.route('/test', methods=['GET'])
def get_tests():
    tests = db.session.execute(
        text("SELECT * FROM test"), 
    ).fetchall()

    tests_list = [
        {
            "test_id": test.test_id,
            "test_name": test.test_name,
        }
        for test in tests
    ]

    return jsonify(tests_list), 200