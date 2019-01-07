from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models import User, Student, Contest
from iml.forms import StudentForm, ContestForm
from iml.core.user.wrappers import login_required
from iml.util import render_custom_template
import datetime

admin = Blueprint("admin", __name__)


@admin.route("/add_contest", methods=["GET", "POST"])
def add_contest():
    contestForm = ContestForm()
    if contestForm.validate_on_submit() and contestForm.submit.data:
        contest = Contest(name = contestForm.name.data,
                          date = datetime.date.today(),
                          question_count = contestForm.question_count,
                          division_id = contestForm.division_id.data)
    return render_custom_template("core/admin/add_contest.html", contestForm=contestForm)
	
