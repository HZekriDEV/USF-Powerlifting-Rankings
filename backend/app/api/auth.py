from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

# Flask Blueprint
auth_bp = Blueprint('auth', __name__)
