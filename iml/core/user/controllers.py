from flask import Blueprint, render_template, session, request, redirect
from iml.models import User

questions = ["what is 3 + 5?", "what is 9 + 10?"]
answers = ["8", "21"]
index = 0

user = Blueprint("user", __name__)

@user.route("/login")
def login():
    return render_template("core/user/temp.html")

@user.route('/questions')
def question():
    return render_template("question.html", number = index+1, content = questions[index])

@user.route('/main', methods = ['POST'])
def main():
    global index
    # if right answer
    if(request.form["answer"]==answers[index]):
        index = index + 1
        print('next question')
        # if no more question
        if (index == len(answers)):
            return redirect('/end')
    return redirect('/questions')
@user.route('/end')
def end():
    return render_template('end.html')
