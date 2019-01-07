from flask import session, redirect, flash, render_template
from iml.util.wrappers import validate_page_access
from iml.util.constants import IS_SITE_ADMIN, IS_NOT_LOGGED_IN


def admin_required(redirect_to=None, to_flash=None):
    def validator(*args, **kwargs):
        # is admin_check
        sess_status = session.get("status", IS_NOT_LOGGED_IN)
        return sess_status >= IS_SITE_ADMIN
    return validate_page_access(redirect_to,
                                to_flash,
                                validator)
