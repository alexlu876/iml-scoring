import re
import graphene
from graphql.error import GraphQLError

from flask_jwt_extended import (
    get_current_user,
)
from iml.api.graphql.wrappers import admin_required
from iml.api.graphql.user.types import User, RegistrationCode
from iml.models import (
    User as UserModel,
    RegistrationCode as RegistrationCodeModel
)
from iml.database import db


class UserInfoInput(graphene.InputObjectType):
    first = graphene.String(required=True, description="First Name")
    last = graphene.String(required=True, description="Last Name")
    email = graphene.String(required=True, description="Email")
    phone_num = graphene.String(required=False, description="Phone Number")

    def validateEmail(self):
        validFormat = re.match(
            r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
            self.email)
        if not validFormat:
            raise GraphQLError("Invalid email format!")
        if UserModel.query.filter_by(email=self.email).first():
            raise GraphQLError("Email not unique!")
        return True


class CodeCreationMutation(graphene.Mutation):
    class Arguments:
        code = graphene.String(required=False)
        school_id = graphene.ID(required=True)
    registration_code = graphene.Field(lambda: RegistrationCode)

    @classmethod
    @admin_required
    def mutate(cls, root, info, school_id, code=None):
        user = get_current_user()
        query = RegistrationCode.get_query(info)
        if (code and query.get(code)):
            raise GraphQLError("Code not unique!")
        else:
            newCode = RegistrationCodeModel(school_id, user.id, code)
            db.session.add(newCode)
            db.session.commit()
            return CodeCreationMutation(newCode)


class UserRegisterMutation(graphene.Mutation):
    class Arguments:
        user_data = UserInfoInput(required=True)
        password = graphene.String(required=True)
        registration_code = graphene.String(
            required=True,
            description="Admin-provided registration code")
    user = graphene.Field(lambda: User)

    @classmethod
    def mutate(cls, root, info, user_data, password, registration_code):
        code = registration_code
        codeObject = RegistrationCodeModel.query.get(code)
        if not codeObject:
            raise GraphQLError("Invalid Registration Code!")
        user = createUserAndAddToSession(
            user_data, password,
            is_admin=False, school=codeObject.school, code=codeObject)
        return UserRegisterMutation(user)


class AdminCreationMutation(graphene.Mutation):
    class Arguments:
        user_data = UserInfoInput(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(lambda: User)

    @classmethod
    @admin_required
    def mutate(cls, root, info, user_data, password):
        user = createUserAndAddToSession(user_data, password, is_admin=True)
        return AdminCreationMutation(user)


def createUserAndAddToSession(userData, password,
                              is_admin=False, school=None, code=None):
    if userData.validateEmail():
        username_base = '{}{}'.format(
            userData.first[0],
            userData.last[:16]).replace(' ', '_')
        username_num = UserModel.query.filter(
            UserModel.username.contains(username_base)).count()+1
        username = '{}{}'.format(
                username_base,
                username_num if username_num > 0 else "").lower()
        user = UserModel(first=userData.first,
                         last=userData.last,
                         email=userData.email,
                         phone_num=userData.phone_num,
                         username=username,
                         password=password,
                         is_admin=is_admin
                         )
        user.school = school
        db.session.add(user)
        if (code):
            code.used_by = user
            db.session.add(code)
        db.session.commit()
        return user
    return None
