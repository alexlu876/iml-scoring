import graphene
from graphql_relay.node.node import from_global_id

def clean_input(graphene_scalar_fields):
    d = {}
    for key, value in graphene_scalar_fields.items():
        if key[-2:] == "id":
            try:
                d[key] = int(value)
            except ValueError:
                d[key] = from_global_id(value)

        else:
            d[key] = value
    return d
