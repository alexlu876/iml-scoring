from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.models import User
from iml.forms import LoginForm


questions = ["what is 3 + 5?", "what is 9 + 10?"]
answers = ["8", "21"]
index = 0

user = Blueprint("user", __name__)


@user.route("/login", methods=["GET", "POST"])
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
                return redirect('/home')
            else:
                flash("Email and password do not match!", "error")
        else:
            flash("Invalid Email!", "error")

    return render_template("core/user/login.html",
                           user=user,
                           title="IML Scoring | Login",
                           loginForm = loginForm,
                           )


@user.route('/questions')
def question():
    return render_template("question.html",
                           number=index+1,
                           content=questions[index])


@user.route('/main', methods = ['POST'])
def main():
    global index
    # if right answer
    if (request.form["answer"] == answers[index]):
        index = index + 1
        print('next question')
        # if no more question
        if (index == len(answers)):
            return redirect('/end')
    return redirect('/questions')


@user.route('/end')
def end():
    return render_template('end.html')


@user.route('/session_info')
def get_session():
    return jsonify(
        {"userdata": session["userdata"],
         "status" : session["status"]
         })

@user.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out!", "message")
    return redirect('/')
