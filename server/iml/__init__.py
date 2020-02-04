from flask import Flask, render_template, jsonify
import click
import csv
import datetime
from flask_session import Session
from flask_migrate import Migrate


from flask_graphql import GraphQLView
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_optional, get_current_user,
    jwt_refresh_token_required, get_jwt_identity,
    create_access_token
)

from flask_mail import Mail, Message

from iml.config import DATABASE_TYPE, SQLITE_FILE_NAME
from iml.config import (
    SQLALCHEMY_TRACK_MODIFICATIONS,
    APP_SECRET_KEY,
    JWT_SECRET_KEY,
    SESSION_TYPE,
    DB_USER, DB_PASS,
    DB_HOST, DATABASE
)
from iml.database import db
from iml.oauth2 import config_oauth

# from iml.core.admin.controllers import admin
# from iml.core.user.controllers import user
# from iml.core.students.controllers import students
# from iml.core.scores.controllers import scores
# from iml.api.private.controllers import private_api
# from iml.api.public.controllers import public_api
# from iml.oauth2.controllers import oauth2

from iml.api.graphql.schemas import gql_schema

from iml.models import User, Season, School, Division, SchoolGrouping, RegistrationCode

from iml.util.generate_db import (
    generate_nyc_divisions, generate_nyc_users,
    generate_nyc_schools, generate_nyc_teams
)

import os

# pathing
TEMPLATE_DIR = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'templates')

STATIC_DIR = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'static')

app = Flask(__name__,
            template_folder=TEMPLATE_DIR,
            static_folder=STATIC_DIR)


# Config
if DATABASE_TYPE == 'sqlite':
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///{}".format(
        SQLITE_FILE_NAME)
elif DATABASE_TYPE == 'mysql':
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://{}:{}@{}/{}".format(
        DB_USER, DB_PASS, DB_HOST, DATABASE
    )
app.config['SECRET_KEY'] = APP_SECRET_KEY
app.config['SESSION_TYPE'] = SESSION_TYPE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SESSION_SQLALCHEMY'] = db
app.config['OAUTH2_REFRESH_TOKEN_GENERATOR'] = True


# set up session and db session
session = Session()
session.init_app(app)


# set up mail session

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": os.environ.get('FLASK_EMAIL_USER'),
    "MAIL_PASSWORD": os.environ.get('FLASK_EMAIL_PASSWORD')
}

app.config.update(mail_settings)
mail = Mail(app)


with app.app_context():
    db.init_app(app)
    db.create_all()
    db.session.commit()
    config_oauth(app)
    if app.config.get("MAIL_USERNAME"):
        msg = Message(subject="Hello",
                      sender=app.config.get("MAIL_USERNAME"),
                      recipients=["noreply@nyciml.org"],
                      body="Restarting application/validating SMTP!")
        mail.send(msg)

# automatic app migration
migrate = Migrate(app, db)


@app.cli.command("create-default-admin")
@click.argument('password')
def create_default_admin(password):
    if User.query.filter_by(email="noreply@nyciml.org").first():
        return
    else:
        new_admin = User(
            first="Admin",
            last="Admin",
            email="noreply@nyciml.org",
            phone_num=None,
            username="admin",
            password=password,
            is_admin=True)
        db.session.add(new_admin)
        db.session.commit()


# create-admin-account run
@app.cli.command("initialize-schools")
@click.argument('season_url', nargs=1)
@click.argument('filename', nargs=1)
def initialize_schools(season_url, filename):
    default_admin = User.query.filter_by(email="noreply@nyciml.org").first()
    if not default_admin:
        print("Set up default admin first!")
        return

    print("Opening file \"{}\"...".format(filename))
    with open(filename, newline='') as file:
        reader = csv.DictReader(file)
        season_obj = Season.query.filter_by(url=season_url).first()
        if not season_obj:
            new_season = Season(name=season_url, url=season_url,
                                start_date=datetime.date.today(),
                                end_date=datetime.date.today()
                                )
            db.session.add(new_season)
            db.session.commit()
            season_obj = new_season

        # default all schools into nyc
        nyc_sg = SchoolGrouping.query.filter_by(url='nyc').first()
        if not nyc_sg:
            nyc_sg = SchoolGrouping(name="NYC", url="nyc")
            db.session.add(nyc_sg)
            db.session.commit()

        # create divisions SophFrosh, Junior, Senior A, Senior B
        divs = {}
        for div_name_url in [('SophFrosh', 'sf'),
                             ('Junior', 'jr'),
                             ('Senior A', 'sra'),
                             ('Senior B', 'srb')]:
            div_obj = Division.query.filter_by(name=div_name_url[0],
                                               season_id=season_obj.id).first()
            if not div_obj:
                div_obj = Division(name=div_name_url[0],
                                   url=div_name_url[1],
                                   season_id=season_obj.id)
                db.session.add(div_obj)
                db.session.commit()
            divs[div_name_url[0]] = div_obj
        for row in reader:
            email = row.get("Coach Email Address").strip()
            coach_name = row.get("Coach Name").strip()
            school_name = row.get("School Name").strip()
            registered_divisions = row.get('Divisions').split(',') if row.get(
                'Divisions') else []
            registered_divisions = [div.strip().replace(
                '-', ''
            ) for div in registered_divisions]
            print(
                "{}|{}|{}|{}".format(
                    email, coach_name, school_name, registered_divisions
                )
            )
            if School.query.filter_by(name=school_name).first():
                print("  School already exists!")
                continue
            else:
                school = School(
                    name=school_name,
                    url=school_name.replace(' ', ''),
                    groupId=nyc_sg.id
                )
                for div in registered_divisions:
                    school.divisions.append(divs[div])
                db.session.add(school)
                db.session.commit()
                reg_codes = []
                for i in range(3):
                    new_code = RegistrationCode(school.id, default_admin.id)
                    db.session.add(new_code)
                    db.session.commit()
                    reg_codes.append(new_code)
                msg = Message(
                    subject="Registration Information For NYCIML Scoring",
                    sender=os.environ.get("FLASK_EMAIL_USER"),
                    recipients=["noreply@nyciml.org", email],
                    )
                msg.html = render_template("email/registration_codes.html",
                                           coach_name=coach_name,
                                           school_name=school_name,
                                           codes=reg_codes
                                           )
                mail.send(msg)

# test account

# temp division adder

# generate_nyc_divisions(app, db)
# generate_nyc_schools(app, db)
# generate_nyc_users(app, db)
# generate_nyc_teams(app, db)

# app.register_blueprint(user, url_prefix="")
# app.register_blueprint(students, url_prefix="/students")
# app.register_blueprint(admin, url_prefix="/admin")
# app.register_blueprint(private_api, url_prefix="/api/private")
# app.register_blueprint(public_api, url_prefix="/api/public")
# app.register_blueprint(scores, url_prefix="/scores")
# app.register_blueprint(oauth2, url_prefix="/oauth2")

jwt = JWTManager(app)

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_TOKEN_LOCATION"] = ['headers']


@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    return User.query.filter_by(email=identity).first() or None


@jwt.user_claims_loader
def add_claims_to_access_token(identity):
    user = User.query.filter_by(email=identity).first()
    if not user:
        return {}
    return {
        'role': 'admin' if user.isAdmin() else 'user',
    }


@app.route('/jwt_verify_refresh', methods=['GET'])
@jwt_refresh_token_required
def jwt_refresh_verify():
    return jwt_verify()


@app.route('/jwt_verify_access', methods=['GET'])
@jwt_optional
def jwt_verify():
    user = get_current_user()
    if user is None:
        return jsonify({"valid": False})
    return jsonify({
        "valid": True
    })

# pure GET refresh
@app.route('/jwt_refresh', methods=['GET'])
@jwt_refresh_token_required
def jwt_refresh():
    identity = get_jwt_identity()
    if not identity:
        return jsonify({})
    newAccessToken = create_access_token(
        identity=identity,
        fresh=False)
    return jsonify(
        {'accessToken': newAccessToken}
    )


app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        name='graphql',
        schema=gql_schema,
        graphiql=True
    )
)

CORS(app)
