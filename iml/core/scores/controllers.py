from flask import Blueprint, session, redirect, flash

from iml.core.user.wrappers import login_required

from iml.database import db
from iml.models import User, Team, Score, Division, Contest, Student
from iml.util import get_user, render_custom_template


scores = Blueprint('scores', __name__)


@scores.route('/update/<contest_id>/<team_id>')
@login_required()
def update_scores(contest_id, team_id):
    user = get_user(session["userdata"]["id"])
    school = user.school
    contest = Contest.query.filter_by(id=contest_id).first()
    team = Team.query.filter_by(id=team_id).first()
    if not (contest and user and team) or (team.school != school) or (contest.division != team.division):
        flash("Unspecified Error (Tell the admin to finish the application)")
        return redirect("/")
    studentsQuery = Student.query.filter_by(school_id=school.id,division_id=contest.division.id)
    students = [student for student in studentsQuery
                if student.isValidParticipant(contest=contest, team=team)]
    return render_custom_template("core/scores/update.html",
                                  user=user,
                                  contest=contest,
                                  students=students,
                                  team=team)

