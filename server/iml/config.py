import os

APP_SECRET_KEY = os.urandom(32).hex()

DATABASE_TYPE = "sqlite"

DB_USER = ""
DB_PASS = ""
DB_HOST = ""
DATABASE = ""

SQLITE_FILE_NAME = "data/foobar.db"

SESSION_TYPE = "filesystem"


SQLALCHEMY_TRACK_MODIFICATIONS = False
