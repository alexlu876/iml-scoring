from functools import wraps
from flask_jwt_extended import (
        verify_jwt_in_request,
        get_jwt_claims,
        )
from cerberus import Validator

from graphql import GraphQLError


# wraps mutate and resolve calls.
def admin_required(f):
    @wraps(f)
    def check_and_call(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims.get('role', 'user') != 'admin':
            # TODO - error handling
            return None
        return f(*args, **kwargs)
    return check_and_call


def validate_input(validator: Validator):
    """Wraps mutate calls and validates input before running."""
    def decorator(f):
        @wraps(f)
        def check_and_call(*args, **kwargs):
            if (not validator):
                raise GraphQLError(
                    "Validator Not Passed!"
                    "Please Contact an Admin!")
            if (not validator.allow_unknown):
                validator.allow_unknown = True
            if (not validator.validate(kwargs)):
                raise GraphQLError(
                    "Invalid Arguments Provided By Client!",
                    extensions={'invalidArgs': {
                        to_camel_case(key): value
                        for key, value in validator.errors.items()
                    }}
                )
            return f(*args, **kwargs)

        return check_and_call
    return decorator


def to_camel_case(snake: str) -> str:
    words = snake.split('_')
    if len(words) == 1:
        return snake
    return (words[0]).join(
        word.title() for word in words[1:])
