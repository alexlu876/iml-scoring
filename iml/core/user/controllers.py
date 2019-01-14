from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models import User, School, Student, Contest, Score, Team, Division
from iml.forms import LoginForm, RegisterForm, ScoresForm
from iml.core.user.wrappers import login_required, login_forbidden
from iml.util import render_custom_template
from iml.util.constants import IS_SITE_ADMIN, IS_LOGGED_IN
from datetime import datetime

user = Blueprint("user", __name__)

@user.route("/login", methods=["GET", "POST"])
@login_forbidden()
def login():
    user = None
    loginForm = LoginForm()

    if loginForm.validate_on_submit() and loginForm.submit.data:
        user = User.query.filter_by(
            email=loginForm.email.data) \
            .first()

        if user is not None:
            if user.checkPassword(loginForm.password.data):
                session["status"] = IS_LOGGED_IN
                session["userdata"] = {
                    "id": user.id,
                    "first": user.first,
                    "last": user.last,
                    "email": user.email,
                }
                if user.is_admin:
                    session["status"] = IS_SITE_ADMIN
                session.permanent = True
                flash("Login Successful!", "success")
                return redirect('/')
            else:
                flash("Email and password do not match!", "error")
        else:
            flash("Your email is not in our system!", "error")

    return render_custom_template("core/user/login.html",
                           user=user,
                           title="IML Scoring | Login",
                           loginForm = loginForm,
                           )
@user.route('/register', methods=["GET", "POST"])
@login_forbidden()
def register():
    user = None
    registerForm = RegisterForm()

    if registerForm.validate_on_submit() and registerForm.submit.data:
        # TODO - uniqueness check, append numbers
        username = registerForm.first.data[0]+registerForm.last.data
        user = User(first=registerForm.first.data,
                    last=registerForm.last.data,
                    email=registerForm.email.data,
                    phone_num=registerForm.phone_num.data,
                    username=username,
                    password=registerForm.password.data,
                    is_admin=False)
        # create a new school object or nah?
        if True:
            school = School(name=registerForm.new_school.data)
        else:
            pass
        user.school = school
        db.session.add(user)
        db.session.add(school)
        db.session.commit()
        flash("succ cess", "success")
        return redirect('/login')


    return render_custom_template("core/user/register.html",
                           user=user,
                           title="IML Scoring | Register",
                           registerForm = registerForm,
                           )


@user.route('/session_info')
def get_session():
    if session.get("userdata") and session.get("status"):
        return jsonify(
            {"userdata": session["userdata"],
             "status" : session["status"]
             })
    return jsonify({})

@user.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out!", "message")
    return redirect('/login')


#competition results display
@user.route('/info')
def info():
    return render_custom_template('results.html')

@user.route('/info/tests')
def testing():

    #school1 = School(name="stuyvesant")

    # student1 = Student(
    #     first = "Alex",
    #     last = "Lu",
    #     username = "gote876",
    #     school_id = "1"
    # )

    # db.session.add(student1)
    # db.session.commit()

    # db.session.add(school1)
    # db.session.commit()

    studentDB = Student.query.all()
    contests = Contest.query.all()
    users = User.query.all()
    teams = Team.query.all()
    score1 = Score(
        question_num = 1,
        is_correct = 1,
        contest_id = 2, #quiz bowl
        student_id = 1, #student alex gote876
        coach_id = 2, # student.id (Gilvir)
        team_id = 1,
        timestamp = datetime.utcnow()
    )
    db.session.add(score1)
    db.session.commit()
    students = Student.query.filter_by(school_id = User.school_id)

    return render_custom_template('tests.html',
                                  studentDB=studentDB,
                                  contests = contests,
                                  users = users,
                                  teams = teams,
                                  students = students )
@user.route('/info/sf')
def info_sf():

    students = [
        {
        'name': "Alex Lu",
        'scores': "1 2 3 4 5 6",
        'total': "26",
        },
        {
        'name': "Andrew X. Chen",
        'scores': "1 2 1 0 0",
        'total': "4",
        }
    ]

    return render_custom_template('results_sf.html',
                                  students = students)

@user.route('/info/jr')
def info_jr():
    return render_custom_template('results_jr.html')

@user.route('/info/sra')
def info_sra():
    return render_custom_template('results_sra.html')

@user.route('/info/srb')
def info_srb():
    return render_custom_template('results_srb.html')

@user.route('/enter_scores', methods=["GET", "POST"])
@login_required()
def enter_scores():
    form = ScoresForm(request.form)

    divisions_query = Division.query.all()
    div_choices = [(div.name, div.name) for div in divisions_query]
    form.division.choices = div_choices


    user = User.query.filter_by(id = session["userdata"]["id"]).first()
    teams_query = Team.query.filter_by(school = user.school)
    team_choices = [(team.id, team.name) for team in teams_query]
    form.team.choices = team_choices


    #students = [(c.id, c.username) for c in Student.query.filter_by(school_id = User.school_id).all()]
    #form.students.choices = students
    return render_custom_template("enter_scores.html",
    form=form,
    )
@user.route('/select_student')
def select_student():
    return " "
@user.route('/')
@user.route('/index')
def index():
    if(user):
        return render_custom_template('index.html',X=request.remote_addr)
    return render_custom_template('index.html', X=request.remote_addr)
