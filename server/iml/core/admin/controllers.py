from flask import Blueprint, flash
from iml.database import db
from iml.models.division import Division
from iml.models import Question, Contest
from iml.forms import NewContestForm
from iml.core.admin.wrappers import admin_required
from iml.util import render_custom_template

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
            question_count = contestForm.question_count.data
            contest = Contest(name=contestForm.name.data,
                              start_time=contestForm.start_time.data,
                              question_count=question_count)
            contest.division = division
            db.session.add(contest)
            db.session.commit()
            for question_num in range(1,question_count+1):
                newQuestion =  Question(contest_id=contest.id,
                                        question_num=question_num,
                                        question_value=1,
                                        question_string=None)
                db.session.add(newQuestion)
                db.session.commit()
            # commit first to assign key
            flash("Contest successfully added!")
        else:
            flash("That division does not exist!")
    return render_custom_template("core/admin/add_contest.html", contestForm=contestForm)
