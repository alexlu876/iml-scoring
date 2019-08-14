from flask import Flask, jsonify
from flask_session import Session
from flask_migrate import Migrate


from flask_graphql import GraphQLView
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_optional, get_current_user, jwt_refresh_token_required, get_jwt_identity, create_access_token
from iml.config import DATABASE_TYPE, SQLITE_FILE_NAME
from iml.config import SQLALCHEMY_TRACK_MODIFICATIONS, APP_SECRET_KEY, SESSION_TYPE
from iml.database import db
from iml.oauth2 import config_oauth

from iml.core.admin.controllers import admin
from iml.core.user.controllers import user
from iml.core.students.controllers import students
from iml.core.scores.controllers import scores
from iml.api.private.controllers import private_api
from iml.api.public.controllers import public_api
from iml.oauth2.controllers import oauth2

from iml.api.graphql.schemas import gql_schema

from iml.models.user import User
from iml.util.generate_db import generate_nyc_divisions, generate_nyc_users, generate_nyc_schools, generate_nyc_teams

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
else:
    pass
app.config['SECRET_KEY'] = APP_SECRET_KEY
app.config['SESSION_TYPE'] = SESSION_TYPE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SESSION_SQLALCHEMY'] = db
app.config['OAUTH2_REFRESH_TOKEN_GENERATOR'] = True


# set up session and db session
session = Session()
session.init_app(app)

with app.app_context():
    db.init_app(app)
    db.create_all()
    db.session.commit()
    config_oauth(app)


# automatic app migration

migrate = Migrate(app, db)


# test account

with app.app_context():
    if not User.query.filter_by(username="admin").first():
        sampleAdmin = User(first="Bank of",
                           last="America",
                           email="ayy@lmao.com",
                           phone_num="1877CARS",
                           username="admin",
                           password="password",
                           is_admin=True
                           )
        db.session.add(sampleAdmin)
        db.session.commit()

# temp division adder

# generate_nyc_divisions(app, db)
# generate_nyc_schools(app, db)
# generate_nyc_users(app, db)
# generate_nyc_teams(app, db)

app.register_blueprint(user, url_prefix="")
app.register_blueprint(students, url_prefix="/students")
app.register_blueprint(admin, url_prefix="/admin")
app.register_blueprint(private_api, url_prefix="/api/private")
app.register_blueprint(public_api, url_prefix="/api/public")
app.register_blueprint(scores, url_prefix="/scores")
app.register_blueprint(oauth2, url_prefix="/oauth2")

jwt = JWTManager(app)

app.config["JWT_SECRET_KEY"] = "CHANGETHISFROMPUBLICREPO"
app.config["JWT_TOKEN_LOCATION"] = [ 'headers']

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
    identity= get_jwt_identity()
    if not identity:
        return jsonify({});
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
        schema = gql_schema,
        graphiql=True
    )
)

CORS(app)
