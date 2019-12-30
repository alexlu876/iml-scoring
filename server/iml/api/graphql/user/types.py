from iml.models import User as UserModel

import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType


class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        exclude_fields = ("password",)
        interfaces = (graphene.relay.Node,)


class UserRelayConnection(graphene.relay.Connection):
    class Meta:
        node = User
