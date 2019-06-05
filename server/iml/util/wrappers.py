from flask import session, redirect, flash, render_template
from functools import wraps

def validate_page_access(redirect_to=None,
                         to_flash=None,
                         validate_function= lambda *args, **kwargs: True,
                         failure_handler= None):
    def decorator(f):
        @wraps(f)
        def check_and_call(*args, **kwargs):
            check = validate_function(*args, **kwargs)
            if check:
                return f(*args, **kwargs)
            elif failure_handler:
                return failure_handler(*args, **kwargs)
            else:
                if redirect_to and to_flash:
                    flash(to_flash)
                    return redirect(redirect_to)
            return render_template("errors/403.html")

        return check_and_call
    return decorator

