from flask import Blueprint

example_bp = Blueprint('example', __name__)

from . import routes