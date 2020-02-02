from functools import wraps
from typing import Dict, Callable, Any
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_claims,
    jwt_optional,
    get_current_user
)

from iml.models import (
    User as UserModel,
    School as SchoolModel
)

from cerberus import Validator

from graphql import GraphQLError


def admin_required(f):
    @wraps(f)
    def check_and_call(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims.get('role', 'user') != 'admin':
            # TODO - error handling
            raise GraphQLError("Admin required!")
            return None
        return f(*args, **kwargs)
    return check_and_call


# Function that takes the viewer id
def require_authorization(params: Dict[str, Callable[[UserModel, Any], bool]]):
    @jwt_optional
    def decorator(f):
        @wraps(f)
        def check_and_call(*args, **kwargs):
            user = get_current_user()
            if not user:
                return GraphQLError(
                    "Not authenticated!")
            for param, check_function in params.items:
                # if the param is not a kwarg, skip it
                if not kwargs.get(param):
                    continue
                check = check_function(user, kwargs.get(param))
                if not check:
                    # TODO -error handling
                    return GraphQLError(
                        "Missing authorization for this action!")
            return f(*args, **kwargs)
        return check_and_call
    return decorator


require_school_admin = require_authorization({
    'school_id':
    lambda user, school_id: user.isSchoolAdmin(SchoolModel.get(school_id))
})


def to_camel_case(snake: str) -> str:
    words = snake.split('_')
    if len(words) == 1:
        return snake
    return (words[0]).join(
        word.title() for word in words[1:])
