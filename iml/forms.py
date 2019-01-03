from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms import validators


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
    old_school = SelectField("School: ", choices= [('Stuyvesant'), ('Stuyvesant')])
    submit = SubmitField("Register")
