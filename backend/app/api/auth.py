from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from .. import db, jwt
from ..models import User, TokenBlocklist


# Flask Blueprint
auth_bp = Blueprint('auth', __name__)


# Callback function to check if a JWT exists in the database blocklist
# From Flask JWT documentation


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

#  Signup route - Stores email, name, role, and hashes password


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    # Searches database for User with matching email
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 409

    # Creating new User instance with hashed password
    new_user = User(email=email, first_name=first_name, last_name=last_name)
    # Hashes password upon accessing JSON payload
    new_user.password = data.get('password')
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User Successfully Created"}), 201

# Signin route - Takes email & password, returns JWT (identity = email)


@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')

    if not email or not data.get('password'):
        return jsonify({"message": "Email and Password are required"}), 400

    # Searches database for User with matching email
    if not User.query.filter_by(email=email).first():
        return jsonify({"message": "Invalid Credentials"}), 401

    user = User.query.filter_by(email=email).first()
    if not user.check_password(data.get('password')):
        return jsonify({"message"
                        "Invalid Credentials"}), 401

    # Creates JWT token associated with user email
    access_token = create_access_token(identity=email)
    return jsonify({"message": "Successfully Logged In",
                    "access_token": access_token}), 200

# Signout route - Requires valid JWT, adds JWT to TokebBlocklist table in database


@auth_bp.route('/signout', methods=['POST'])
@jwt_required()
def signout():
    token = get_jwt()
    jti = token.get('jti')
    ttype = token.get('type')

    # Revoking JWT by adding to TokenBlocklist table
    db.session.add(TokenBlocklist(jti=jti, token_type=ttype))
    db.session.commit()

    return jsonify({"message": "Successfully Logged Out"}), 200


# @auth_bp.route('/test', methods=['GET'])
# @jwt_required()
# def test():
#     return jsonify({"message": "Blocklist not working"}), 200
