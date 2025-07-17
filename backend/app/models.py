from . import db, bcrypt
from datetime import datetime, timezone


'''
    Contains data models for SQLAlchemy to communicate with PostgreSQL
'''


# This could be expanded to fit the needs of your application. For example,
# it could track who revoked a JWT, when a token expires, notes for why a
# JWT was revoked, an endpoint to un-revoked a JWT, etc.
# Making jti an index can significantly speed up the search when there are
# tens of thousands of records. Remember this query will happen for every
# (protected) request,
# If your database supports a UUID type, this can be used for the jti column
# as well
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)
    token_type = db.Column(db.String(16), nullable=False)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))


'''User Model, contains user account information and authorize login'''


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(120), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    is_officer = db.Column(db.Boolean, nullable=False)
    time_created = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))

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


'''Officer Model, subtype of User, has special priviliges; Officer's non-disjoint to Athlete'''


class Officer(db.Model):
    id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    user = db.relationship(
        "User", backref=db.backref("officer", uselist=False))
    role = db.Column(db.String(80), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    about_role = db.Column(db.Text, nullable=False)


'''Athlete Model, subtype of User, contains athlete information; Athlete's non-disjoint to Officer'''


class Athlete(db.Model):
    id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    user = db.relationship(
        "User", backref=db.backref("athlete", uselist=False))
    gender = db.Column(db.String(60), nullable=False)
    weight_class = db.Column(db.Float)


'''LiftRecord Model, to hold best lifts by each athlete (gym/competition)'''


class LiftRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey("athlete.id"))
    athlete = db.relationship("Athlete", backref="lift_records")
    competition = db.Column(db.Boolean, nullable=False)
    # Squat/Bench/Deadlift
    lift_type = db.Column(db.String(60), nullable=False)
    weight_kg = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


'''Donations Model, contains history of donations'''


class Donations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", backref="donations")
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    stripe_payment_intent = db.Column(db.String(255))


'''Videos Model- Videos Stored in AWS(S3); Additional Information is stored in this Model'''


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    s3_url = db.Column(db.String(255), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    category = db.Column(db.String(50))  # technique, prep, coaching, etc.
    date_uploaded = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))


'''Program Model, Programs Stored in AWS(S3); Additional Information is Stored in this Model'''


class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    s3_url = db.Column(db.String(255), nullable=False)
    is_free = db.Column(db.Boolean, default=True)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    date_uploaded = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))
