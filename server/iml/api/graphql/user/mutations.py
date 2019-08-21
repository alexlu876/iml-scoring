import re
import graphene
from graphql.error import GraphQLError
from iml.api.graphql.wrappers import admin_required
from iml.api.graphql.user.types import User
from iml.models import User as UserModel
from iml.database import db


class UserInfoInput(graphene.InputObjectType):
    first = graphene.String(required=True, description="First Name")
    last = graphene.String(required=True, description="Last Name")
    email = graphene.String(required=True, description="Email")
    phoneNum = graphene.String(required=False, description="Phone Number")

    def validateEmail(self):
        validFormat =  re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
                self.email)
        if not validFormat:
            raise GraphQLError("Invalid email format!")
        if UserModel.query.filter_by(email=self.email).first():
            raise GraphQLError("Email not unique!")
        return True

class UserRegisterMutation(graphene.Mutation):
    class Arguments:
        userData = UserInfoInput(required=True)
        password = graphene.String()

    user = graphene.Field(lambda: User)

    @classmethod
    def mutate(cls, root, info, userData, password):
        user = createUserAndAddToSession(userData, password, is_admin=False)
        return UserRegisterMutation(user)


class AdminCreationMutation(graphene.Mutation):
    class Arguments:
        userData = UserInfoInput(required=True)
        password = graphene.String()

    user = graphene.Field(lambda: User)

    @classmethod
    @admin_required
    def mutate(cls, root, info, userData, password):
        user = createUserAndAddToSession(userData, password, is_admin=True)
        return AdminCreationMutation(user)

def createUserAndAddToSession(userData, password, is_admin=False):
    if userData.validateEmail():
        username_base = '{}{}'.format(userData.first[0],
                                       userData.last[:16]).replace(' ','_')
        username_num = UserModel.query.filter(UserModel.username.contains(username_base)).count()+1
        username = '{}{}'.format(
                username_base,
                username_num if username_num > 0 else "").lower()
        user = UserModel(first=userData.first,
                last=userData.last,
                email=userData.email,
                phone_num=userData.phoneNum,
                username=username,
                password=password,
                is_admin=is_admin
                )
        db.session.add(user)
        db.session.commit()
        return user
    return None

