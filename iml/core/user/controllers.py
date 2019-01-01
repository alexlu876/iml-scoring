from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.models import User
from iml.forms import LoginForm, RegisterForm


questions = ["what is 3 + 5?", "what is 9 + 10?"]
answers = ["8", "21"]
index = 0

user = Blueprint("user", __name__)
login = False

@user.route("/login", methods=["GET", "POST"])
def login():
    global login
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
                login = True
                flash("Login Successful!", "success")
                return redirect('/')
            else:
                flash("Email and password do not match!", "error")
        else:
            flash("Invalid Email!", "error")

    return render_template("core/user/login.html",
                           user=user,
                           title="IML Scoring | Login",
                           loginForm = loginForm,
                           )
@user.route('/register', methods=["GET", "POST"])
def register():
	user = None
	registerForm = RegisterForm()

	if registerForm.validate_on_submit() and registerForm.submit.data:
		email = registerForm.email.data
		password = registerForm.password.data

		user = User("d", "c", email, "4204206969", "dc", password, False)
		flash("succ cess", "success")
		return redirect('/login')


	return render_template("core/user/register.html",
							user=user,
							title="IML Scoring | Register",
							registerForm = registerForm,
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
    global login
    session.clear()
    flash("You have been logged out!", "message")
    login = False
    return redirect('/login')

competition = [
    {
        'name' : 'Datian Zhang',
        'score' : {'Q1' : '1',
                   'Q2' : '1' }
    },
    {
        'name' : 'Alex Lu',
        'score' : '0'
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
        'name' : 'Haiyao Uil',
        'score' : '0'
    }
]
@user.route('/info')
def info():
    return render_template('data.html', competition = competition, user = user)

@user.route('/')
@user.route('/index')
def index():
    if(login == False):
        return render_template('index.html',X=request.remote_addr)
    return render_template('index.html', X=request.remote_addr, user = user)
