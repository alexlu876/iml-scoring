from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models import User, Student
from iml.forms import StudentForm
from iml.core.user.wrappers import login_required

admin = Blueprint("admin", __name__)

