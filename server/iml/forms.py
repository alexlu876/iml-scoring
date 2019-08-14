from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, IntegerField, DateField, DateTimeField, TextAreaField
from wtforms import Form, validators

# for wtforms

# custom string field that only allows spaces, underscores, etc.
RE_STRING = r'^[\w\s+-]+$'

def processName(string):
    return string and string.strip()

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
    first = StringField("First Name:",
                        [validators.DataRequired(),
                         validators.Regexp(RE_STRING)
                         ],
                        filters=[processName]
                        )
    last = StringField("Last Name:",
                        [validators.DataRequired(),
                         validators.Regexp(RE_STRING)
                         ],
                        filters=[processName]
                        )
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


class NewStudentForm(FlaskForm):
    first = StringField("First Name:",
                        [validators.DataRequired(),
                         validators.Regexp(RE_STRING)
                         ],
                        filters=[processName]
                        )
    last = StringField("Last Name:",
                        [validators.DataRequired(),
                         validators.Regexp(RE_STRING)
                         ],
                        filters=[processName]
                        )
    # REQUIRES coerce as a result of using integer ids
    team = SelectField("Default Team", [validators.DataRequired()], choices=[], coerce=int)
    submit = SubmitField("Add Student")

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
    division = SelectField("div:", [validators.DataRequired()], choices=[])
    team = SelectField("team:", [validators.DataRequired()], choices=[])
    #students = SelectField("Students",  choices=[], coerce = int)
    #score = StringField("score:", [validators.DataRequired()])
    submit = SubmitField("Submit")
    #questionNum = IntegerField("nums of quest", [validators.DataRequired()])

class OAuth2AuthForm(FlaskForm):
    submit = SubmitField("Submit")

class OAuth2ClientCreationForm(FlaskForm):
    client_name = StringField("Client Name")
    client_uri = StringField("Client URI")
    # account, account.readonly, scores
    scope = SelectField("Scopes", [validators.DataRequired()],
                        choices=[
                            ("account", "account"),
                            ("account.readonly", "account.readonly"),
                        ])
    redirect_uri = TextAreaField("Redirect URIs")
    grant_type = TextAreaField("Allowed Grant Types")
    response_type = TextAreaField("Allowed Response Types")
    token_endpoint_auth_method = \
        SelectField(
            "Token Endpoint Auth Method",
            [validators.DataRequired()],
            choices=[("client_secret_basic", "client_secret_basic"),
                     ("client_secret_post", "client_secret_post"),
                     ("none", "none")])
    submit = SubmitField("Submit")
