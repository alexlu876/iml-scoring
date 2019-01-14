from flasks import Blueprint, session, redirect, flash
from iml.util import render_custom

private_api = Blueprint("private_api", __name__)
