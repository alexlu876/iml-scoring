from iml.models import User as UserModel
from graphene_sqlalchemy import SQLAlchemyObjectType

class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        exclude_fields=("password",)
