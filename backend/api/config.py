import os
from dotenv import load_dotenv

# Load .env file only in development
if os.getenv('FLASK_ENV') != 'production':
    load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///default.db')  # Fallback to SQLite
    SQLALCHEMY_TRACK_MODIFICATIONS = False