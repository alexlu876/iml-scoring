from iml.models import User as UserModel
from iml.models import RegistrationCode as RegistrationCodeModel

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


class RegistrationCode(SQLAlchemyObjectType):
    class Meta:
        model = RegistrationCodeModel
        interfaces = (graphene.relay.Node,)


class RegistrationCodeRelayConnection(graphene.relay.Connection):
    class Meta:
        node = RegistrationCode
