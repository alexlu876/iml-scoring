import flask
from iml.models import User

session = flask.session


def get_user(user_id):
    return User.query.filter_by(id=user_id).first()


# MUST be run within app context
def render_custom_template(*args, **kwargs):
    # not logged in
    status = 0
    user = None
    userdata = session.get("userdata")
    if session.get("userdata"):
        user = get_user(session["userdata"]["id"])
        status = session["status"]

    if "status" not in kwargs:
        kwargs["status"] = status
    if "user" not in kwargs:
        kwargs["user"] = user
    if "userdata" not in kwargs:
        kwargs["userdata"] = userdata
    return flask.render_template(*args, **kwargs)
