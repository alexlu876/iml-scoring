from cerberus import Validator

from iml.api.graphql.utils import localize_id

from iml.models import (
    Student as StudentModel,
    User as UserModel
)


studentMutationValidator = Validator(
    {
        'first': {'minlength': 1, 'maxlength': 64},
        'last': {'minlength': 1, 'maxlength': 64},
        'nickname': {'minlength': 1, 'maxlength': 64},
        'graduation_year': {'min': 2018, 'max': 2050},
    }
)

