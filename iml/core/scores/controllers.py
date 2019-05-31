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
        flash("Unspecified Error (Tell the admin to fix the application the application)")
        return redirect("/")
    studentsQuery = Student.query.filter_by(school_id=school.id,division_id=contest.division.id)
    students = [student for student in studentsQuery
                if student.isValidParticipant(contest=contest, team=team)]
    return render_custom_template("core/scores/update.html",
                                  user=user,
                                  contest=contest,
                                  students=students,
                                  team=team)

@scores.route('/view/contest/<contest_id>')
def view_contest_scores(contest_id):
    contest = Contest.query.get(contest_id)
    if not contest:
        return redirect('/view')
    # TODO - come up wikth less redundant element gathering for template
    return render_custom_template("core/scores/view_contest.html",
                                  contest = contest,
                                  students = contest.getAttendees().order_by(Student.school_id))


@scores.route('/view/division/<division_url>')
def view_division(division_url):
    division = Division.query.filter_by(url=division_url).first()
    if not division:
        return redirect('/view')
    return render_custom_template("core/scores/view_division.html",
                                  division = division,
                                  students = division.getParticipants().order_by(Student.school_id))

@scores.route('/view')
def view_scores_homepage():
    divisions = Division.query.all()
    return render_custom_template("core/scores/view_all.html",
                                  divisions=divisions)

