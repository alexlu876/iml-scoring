from functools import wraps
from flask_jwt_extended import (
        verify_jwt_in_request,
        get_jwt_claims,
        )
def admin_required(f):
    @wraps(f)
    def check_and_call(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims.get('role', 'user') != 'admin':
            #todo - error handling
            return None
        return f(*args, **kwargs)
    return check_and_call


