from flask import Blueprint, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models.school import School
from iml.models import User
from iml.forms import LoginForm, RegisterForm
from iml.core.user.wrappers import login_forbidden
from iml.util import render_custom_template
from iml.util.constants import IS_SITE_ADMIN, IS_LOGGED_IN

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
                dest_url = request.args.get('next') or '/'
                return redirect(dest_url)
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


@user.route('/')
@user.route('/index')
def index():
    return render_custom_template('index.html', X=request.remote_addr)
