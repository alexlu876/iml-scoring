import graphene
from graphql_relay.node.node import from_global_id


def clean_input(graphene_scalar_fields):
    d = {}
    for key, value in graphene_scalar_fields.items():
        if key[-2:].lower() == "id":
            d[key] = localize_id(value)
        else:
            d[key] = value
    return d


def localize_id(grapheneID):
    if grapheneID is None:
        return None
    try:
        grapheneID = int(grapheneID)
    except ValueError:
        grapheneID = from_global_id(grapheneID)
        grapheneID = int(grapheneID[1])
    return grapheneID


def update_model_with_dict(obj, props):
    for key, value in props.items():
        try:
            getattr(obj, key)
            setattr(obj, key, value)
        except AttributeError:
            print(f"key does not exist! {obj}")
