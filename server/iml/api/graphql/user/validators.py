from cerberus import Validator

userInfoValidator = Validator(
    {
        'first': {'minlength': 1, 'maxlength': 64},
        'last': {'minlength': 1, 'maxlength': 64}
    }
)
