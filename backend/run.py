from flask import Flask, send_from_directory, jsonify
from api import register_extensions, register_blueprints
from api.config import Config
import os

# Initialize the Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Register extensions and blueprints
register_extensions(app)
register_blueprints(app)

# Serve React app only in production
if os.getenv("FLASK_ENV") == "production":
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)