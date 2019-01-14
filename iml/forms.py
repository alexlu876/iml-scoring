from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, IntegerField, DateField, DateTimeField
from wtforms import Form, validators

# for wtforms

class LoginForm(FlaskForm):
    email = StringField("Email: ",
                        [validators.DataRequired(),
                         validators.Length(min=3,
                                           max=25),
                         validators.Email()]
                       )
    password = PasswordField("Password: ",
                             [validators.DataRequired(),
                              validators.Length(min=3,
                                                max=25)])
    submit = SubmitField("Login")


class RegisterForm(FlaskForm):
    first = StringField("First Name:", [validators.DataRequired()])
    last = StringField("Last Name:", [validators.DataRequired()])
    password = PasswordField("Password: ",
                             [validators.DataRequired(),
                              validators.Length(min=3,
                                                max=25)])
    phone_num = StringField("Phone Number:")

    email = StringField("Email: ",
                        [validators.DataRequired(),
                         validators.Length(min=3,
                                           max=25),
                         validators.Email()],)

    new_school = StringField("School (If not in Dropdown)")
    submit = SubmitField("Register")

class StudentForm(FlaskForm):
    first = StringField("First Name:", [validators.DataRequired()])
    last = StringField("Last Name:", [validators.DataRequired()])
    username = StringField("Username", [validators.DataRequired()])
    submit = SubmitField("Login")

    # school taken from coaches' session

class NewContestForm(FlaskForm):
    name = StringField("Contest Name", [validators.DataRequired()])
    #date
    question_count = IntegerField("Question Count (Likely 6)")
    division = SelectField("Division",  choices=[])
    # %Y-%m-%d %H:%M:%S'
    start_time = DateTimeField("Time", [validators.DataRequired()], format='%Y-%m-%d %H:%M')
    submit = SubmitField("Submit")

class ScoresForm(Form):
    #dropdown_students = [('aryan', 'bhatt'), ('andrew', 'chen')]
    #team = StringField("team:", [validators.DataRequired()])
    students = SelectField("Students",  choices=[], coerce = int)
    score = StringField("score:", [validators.DataRequired()])
    submit = SubmitField("Submit")
    questionNum = IntegerField("nums of quest", [validators.DataRequired()])
