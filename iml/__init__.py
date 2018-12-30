from flask import Flask
from flask import render_template
from flask import request
from flask_session import Session
from flask_migrate import Migrate

from iml.config import DATABASE_TYPE, SQLITE_FILE_NAME
from iml.config import SQLALCHEMY_TRACK_MODIFICATIONS, APP_SECRET_KEY, SESSION_TYPE
from iml.database import db
from iml.core.user.controllers import user

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


# set up session and db session
session = Session()
session.init_app(app)

with app.app_context():
    db.init_app(app)
    db.create_all()
    db.session.commit()


# automatic app migration

migrate = Migrate(app, db)

### TEMPORARY ROUTER CHECKER ###


@app.route('/')
def hello_j():
    return render_template('temp.html', X=request.remote_addr)


app.register_blueprint(user, url_prefix="")
