import flask
from iml.models import User

session = flask.session


def get_user(user_id):
    return User.query.filter_by(id=user_id).first()


# MUST be run within app context
def render_custom_template(*args, **kwargs):
    # not logged in
    status = 0
    # no user
    user = None
    if session.get("userdata"):
        user = User.query.filter_by(id=session["userdata"]).first()
        status = session["status"]
        return flask.render_template(*args, user=user,userdata=session.get("userdata"), status=status, **kwargs)
