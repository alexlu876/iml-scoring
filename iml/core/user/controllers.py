from flask import Blueprint, render_template, session
from iml.models import User

user = Blueprint("user", __name__)
