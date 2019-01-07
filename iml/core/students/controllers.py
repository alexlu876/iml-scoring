from flask import Blueprint, render_template, session, request, redirect, flash, jsonify
from iml.database import db
from iml.models import User, Student
from iml.forms import StudentForm
from iml.core.user.wrappers import login_required
from iml.util import render_custom_template

students = Blueprint("students", __name__)

@students.route('/add_student', methods = ["GET","POST"])
@login_required()
def addStudents():
    studentForm = StudentForm()

    if studentForm.validate_on_submit() and studentForm.submit.data:
        newStudent = Student.query.filter_by(
            username=studentForm.username.data
        ).first()
        if newStudent is None:
            school_id = User.query.filter_by(id = session["userdata"]["id"]).first().school_id

            newStudent = Student(first=studentForm.first.data,
                                 last= studentForm.last.data,
                                 username=studentForm.username.data,
                                 school_id = school_id
                                 )
            db.session.add(newStudent)
            db.session.commit()
        else:
            flash("username already taken!")

        return redirect('/add_student')
    return render_custom_template("core/students/addStudents.html",
                           title="Add a student",
                           studentForm = studentForm
                           )
						   
@students.route('/show_students', methods = ["GET"])
def show_students():
	allStudents = Student.query.all()
	return render_custom_template("core/students/show_students.html", allStudents = allStudents)



