from flask import session, redirect, flash, render_template
from flask import request, url_for
from iml.util.wrappers import validate_page_access
from iml.util.constants import IS_LOGGED_IN, IS_NOT_LOGGED_IN


def login_required(redirect_to=None, to_flash=None):
    # returns whether login status is high enough to be considered logged in
    if not (redirect_to or to_flash):
        to_flash = "Login to view this page!"
        redirect_to = "/login"

    def handler(*args, **kwargs):
        next = url_for(request.endpoint, **request.view_args)
        flash(to_flash)
        return redirect(url_for('user.login',next=next))


    def validator(*args, **kwargs):
        sess_status = session.get("status", IS_NOT_LOGGED_IN)
        return sess_status >= IS_LOGGED_IN
    return validate_page_access(redirect_to,
                                to_flash,
                                validator,
                                handler)


def login_forbidden(redirect_to=None, to_flash=None):
    def validator(*args, **kwargs):
        sess_status = session.get("status", IS_NOT_LOGGED_IN)
        return sess_status < IS_LOGGED_IN

    return validate_page_access(redirect_to,
                                to_flash,
                                validator)
