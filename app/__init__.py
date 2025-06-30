from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app():
    load_dotenv()

    app = Flask(__name__)
    db.init_app(app)
    bcrypt.init_app(app)

    app.config["SQLAlCHEMY_DATA_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

    with app.app_context():
        db.create_all()

    return app
