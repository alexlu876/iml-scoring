import flask
from iml.models import User

session = flask.session


def get_user(user_id):
    return User.query.filter_by(id=user_id).first()


# MUST be run within app context
def render_custom_template(*args, **kwargs):
    # not logged in
    kwargs["status"] = 0
    # no user
    kwargs["user"] = None
    kwargs["userdata"] = session.get("userdata")
    if session.get("userdata"):
        kwargs["user"] = User.query.filter_by(id=session["userdata"]["id"]).first()
        kwargs["status"] = session["status"]
    return flask.render_template(*args, **kwargs)
