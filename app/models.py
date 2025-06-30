from app import db, bcrypt
from datetime import datetime, timedelta, timezone


# User Model (Accounts)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    _password_hash = db.Column(db.String(120), nullable=False)
    is_officer = db.Column(db.Boolean, nullable=False)
    time_created = db.Column(db.DateTime, nullable=False)

    @property
    def password(self):
        raise AttributeError("Password: write-only field")

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(
            password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"
