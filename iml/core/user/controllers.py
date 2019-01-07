from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models import User, School
from iml.forms import LoginForm, RegisterForm
from iml.core.user.wrappers import login_required, login_forbidden
from iml.util import render_custom_template


user = Blueprint("user", __name__)
logged_in = False

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
                session["status"] = 1
                session["userdata"] = {
                    "id": user.id,
                    "first": user.first,
                    "last": user.last,
                    "email": user.email,
                }
                session.permanent = True
                flash("Login Successful!", "success")
                return redirect('/')
            else:
                flash("Email and password do not match!", "error")
        else:
            flash("Invalid Email!", "error")

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
    global login
    session.clear()
    flash("You have been logged out!", "message")
    login = False
    return redirect('/login')

#data for one competition, displayed in /results
competition = [
    {
        'name' : 'Datian Zhang',
        'score' : {'Q1' : '1',
                   'Q2' : '1' }
    },
    {
        'name' : 'Alex Lu',
        'score' : '6'
    },
    {
        'name' : 'Andrew Chen',
        'score' : '0'
    },
    {
        'name' : 'Gilvir Gill',
        'score' : '0'
    },
    {
        'name' : 'Haiyao Uiliu',
        'score' : '0'
    }
]

#competition results display
@user.route('/info')
def info():
    return render_custom_template('data.html', competition = competition, user = user)

@user.route('/')
@user.route('/index')
def index():
    if(user):
        return render_custom_template('index.html',X=request.remote_addr)
    return render_custom_template('index.html', X=request.remote_addr, user = user)
