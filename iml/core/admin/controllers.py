from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models import User, Student, Division, Contest
from iml.forms import NewContestForm
from iml.core.user.wrappers import login_required
from iml.core.admin.wrappers import admin_required
from iml.util import render_custom_template
import datetime

admin = Blueprint("admin", __name__)

@admin.route("/divisions", methods=["GET", "POST"])
@admin_required()
def manage_divisions():
    divisions = Division.query.all()
    return render_custom_template("core/admin/divisions.html",
                                  divisions = divisions)

@admin.route("/division/<div_url>/contests", methods=["GET"])
@admin_required()
def list_contests(div_url):
    # TODO div_url check
    division = Division.query.filter_by(url=div_url).first()
    contests = Contest.query.filter_by(division_id=division.id)
    return render_custom_template("core/admin/contests.html",
                                  contests = contests)
@admin.route("/add_contest", methods=["GET", "POST"])
@admin_required()
def add_contest():
    contestForm = NewContestForm()
    divisions_query = Division.query.all()
    choices = [(div.name, div.name) for div in divisions_query]
    contestForm.division.choices = choices

    if contestForm.validate_on_submit() and contestForm.submit.data:
        division = Division.query.filter_by(name=contestForm.division.data).first()
        if division:
            contest = Contest(name=contestForm.name.data,
                              start_time=contestForm.start_time.data,
                              question_count=contestForm.question_count.data)
            contest.division = division
            db.session.add(contest)
            db.session.commit()
            flash("Contest successfully added!")
        else:
            flash("That division does not exist!")
    return render_custom_template("core/admin/add_contest.html", contestForm=contestForm)
