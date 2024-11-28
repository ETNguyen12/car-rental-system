from flask import Flask, send_from_directory, jsonify
from api import register_extensions, register_blueprints
from api.config import Config
import os

# Serve React app only in production
if os.getenv("FLASK_ENV") == "production":
    app = Flask(__name__, static_folder='build', static_url_path='')
    app.config.from_object(Config)

    register_extensions(app)
    register_blueprints(app)

    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')
    
# Regular flask app in development
else: 
    app = Flask(__name__)
    app.config.from_object(Config)

    register_extensions(app)
    register_blueprints(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)