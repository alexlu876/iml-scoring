import os
from os import environ

APP_SECRET_KEY = environ.get('FLASK_APP_SECRET_KEY') or os.urandom(32).hex()

# if a key is not speciified, then logins will only persist the length
# of the server...
JWT_SECRET_KEY = environ.get('FLASK_JWT_SECRET_KEY') or os.urandom(32).hex()

DATABASE_TYPE = environ.get('FLASK_DATABASE_TYPE') or "sqlite"

DB_USER = environ.get('FLASK_DB_USER') or ""
DB_PASS = environ.get('FLASK_DB_PASS') or ""
DB_HOST = environ.get('FLASK_DB_HOST') or ""
DATABASE = environ.get('FLASK_DATABASE') or ""

PROJECT_ROOT = os.path.dirname(os.path.realpath(__file__))
SQLITE_FILE_NAME = os.path.join(PROJECT_ROOT, "data", "foobar.db")

SESSION_TYPE = "filesystem"


SQLALCHEMY_TRACK_MODIFICATIONS = False
