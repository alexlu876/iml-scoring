from flask import session, redirect, flash, render_template
from iml.util.wrappers import validate_page_access
from iml.util.constants import IS_LOGGED_IN, IS_NOT_LOGGED_IN


def login_required(redirect_to=None, to_flash=None):
    # returns whether login status is high enough to be considered logged in
    def validator(*args, **kwargs):
        sess_status = session.get("status", IS_NOT_LOGGED_IN)
        return sess_status >= IS_LOGGED_IN

    return validate_page_access(redirect_to,
                                to_flash,
                                validator)


def login_forbidden(redirect_to=None, to_flash=None):
    def validator(*args, **kwargs):
        sess_status = session.get("status", IS_NOT_LOGGED_IN)
        return sess_status < IS_LOGGED_IN

    return validate_page_access(redirect_to,
                                to_flash,
                                validator)
