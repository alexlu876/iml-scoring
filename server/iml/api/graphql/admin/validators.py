from cerberus import Validator

from iml.api.graphql.utils import localize_id

from iml.models import (
    Season as SeasonModel,
    Division as DivisionModel
)


def season_exists(field, value, error):
    id = localize_id(value)
    if not SeasonModel.query.get(id):
        error(field, 'Season with id doesnt exist: {}'.format(id))


def successor_exists(field, value, error):
    id = localize_id(value)
    if not DivisionModel.query.get(id):
        error(field, 'Successor with id doesnt exist: {}'.format(id))


divisionMutationValidator = Validator(
    {
        'name': {'minlength': 3, 'maxlength': 64},
        'url': {'regex': '^[a-zA-Z0-9_-]{1,}'},
        'season_id': {'check_with': season_exists},
        'successor_id': {'check_with': successor_exists},
        'alternate_limit': {'max': 10}
    }
)


seasonMutationValidator = Validator(
    {
        'name': {'minlength': 3, 'maxlength': 64},
        'url': {'regex': '^[a-zA-Z0-9_-]{1,}'},
        'start_date': {},
        'end_date': {},
    }
)
