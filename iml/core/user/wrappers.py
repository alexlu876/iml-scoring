from flask import session, redirect, flash, render_template
from iml.util.wrappers import validate_page_access


def login_required(redirect_to=None, to_flash=None):
    def validator(*args, **kwargs):
        return session.get("status",0) == 1
    return validate_page_access(redirect_to,
                                to_flash,
                                validator)


def login_forbidden(redirect_to=None,to_flash=None):
    def validator(*args, **kwargs):
        return session.get("status",0) != 1
    return validate_page_access(redirect_to,
                                to_flash,
                                validator)
