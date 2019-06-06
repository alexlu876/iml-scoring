from flask import Blueprint, session, redirect, flash
from iml.database import db
from iml.models.team import Team
from iml.models import Student
from iml.forms import NewStudentForm
from iml.core.user.wrappers import login_required
from iml.util import get_user, render_custom_template

students = Blueprint("students", __name__)

@students.route('/add_student', methods = ["GET","POST"])
@login_required()
def addStudents():
    user = get_user(session["userdata"]["id"])
    studentForm = NewStudentForm()
    school = user.school

    # list of divisions that a school participates in
    schools_divisions = school.getDivisionsList()
    school_teams_list = []
    for team in school.teams:
        formatted_name = '{} ({})'.format(team.name, team.division.name)
        school_teams_list.append((team.id, formatted_name))

    school_teams_list += [(-1*division.id, division.name + ' Alternate') for division in schools_divisions]

    studentForm.team.choices = school_teams_list

    if studentForm.validate_on_submit() and studentForm.submit.data:
        team_id = studentForm.team.data
        username_base = '{}_{}'.format(studentForm.first.data[:16],
                                       studentForm.last.data[:16]).replace(' ','_')
        username_num = Student.query.filter(Student.username.contains(username_base)).count()+1
        username = '{}{}'.format(username_base,
                                 username_num).lower()

        newStudentTeamId = None
        newStudentDivisionId = None
        if team_id < 0:
            newStudentDivisionId = team_id * -1
        else:
            newStudentTeamId = team_id
            # TODO - make this query less
            team = Team.query.filter_by(id=team_id).first()
            print(team)
            newStudentDivisionId = team.division_id

        newStudent = Student(first=studentForm.first.data,
                             last= studentForm.last.data,
                             username=username,
                             )
        newStudent.school = school
        newStudent.division_id = newStudentDivisionId
        newStudent.team_id = newStudentTeamId

        db.session.add(newStudent)
        db.session.commit()
        flash("Student successfully added!")
        return redirect("/students/manage")
    return render_custom_template("core/students/add_student.html",
                           title="Add a student",
                           studentForm = studentForm
                           )

@students.route('/manage', methods = ["GET"])
@login_required()
def show_students():
    user = get_user(session["userdata"]["id"])
    students = user.school.students
    return render_custom_template("core/students/manage.html",
                                  students=students)
