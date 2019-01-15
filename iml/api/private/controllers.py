from flask import Blueprint, session, redirect, flash
from iml.util import render_custom_template

private_api = Blueprint("private_api", __name__)
