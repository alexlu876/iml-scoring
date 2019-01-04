from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models import User, Student
from iml.forms import StudentForm

students = Blueprint("students", __name__)

@students.route('/addStudents', methods = ["GET","POST"])
def addStudents():
    studentForm = StudentForm()

    if studentForm.validate_on_submit() and studentForm.submit.data:
        newStudent = Student.query.filter_by(
            username=studentForm.username.data
        ).first()
        if newStudent is None:
            newStudent = Student(first=studentForm.first.data,
                                 last= studentForm.last.data,
                                 username=studentForm.username.data,
                                 school_id = User.query.filter_by(id = db.session["userdata"]["id"].first())
                                 )
        else:
            flash("username already taken!")
        return redirect('/addStudents')
    return render_template("core/students/addStudents.html",
                           title="Add a student",
                           studentForm = studentForm
                           )
