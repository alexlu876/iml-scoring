import os

APP_SECRET_KEY = os.urandom(32).hex()

DATABASE_TYPE = "sqlite"

DB_USER = ""
DB_PASS = ""
DB_HOST = ""
DATABASE = ""

PROJECT_ROOT = os.path.dirname(os.path.realpath(__file__))
SQLITE_FILE_NAME = os.path.join(PROJECT_ROOT, "data", "foobar.db")

SESSION_TYPE = "filesystem"


SQLALCHEMY_TRACK_MODIFICATIONS = False
