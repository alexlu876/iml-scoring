import re
import os
import graphene
from graphql.error import GraphQLError
from flask_jwt_extended import (
    get_current_user,
)
from flask_mail import Message
from flask import render_template

from iml.api.graphql.wrappers import admin_required
from iml.api.graphql.utils import localize_id
from iml.api.graphql.user.types import User, RegistrationCode
from iml.models import (
    User as UserModel,
    RegistrationCode as RegistrationCodeModel,
    PasswordReset as PasswordResetModel,
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

    def validateNames(self):
        if (len(self.first) < 1 or len(self.first) > 64):
            raise GraphQLError("Invalid first name!")
        if (len(self.last) < 1 or len(self.last) > 64):
            raise GraphQLError("Invalid first name!")
        return True

    def validate(self):
        return self.validateEmail() and self.validateNames()


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
            newCode = RegistrationCodeModel(
                localize_id(school_id),
                user.id,
                code)
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
        if codeObject.used_by:
            raise GraphQLError("Registration Code already used!")
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
    if userData.validate():
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


class PasswordResetRequestMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, email):
        from iml import mail
        user = User.get_query(info).filter_by(email=email).first()
        if not user:
            raise GraphQLError("Invalid email!")
        password_reset = PasswordResetModel(user.id)
        db.session.add(password_reset)
        db.session.commit()
        msg = Message(
            subject="Password Reset Request for NYCIML Scores",
            sender=os.environ.get("FLASK_EMAIL_USER"),
            recipients=[email],
        )
        msg.html = render_template("email/password_reset.html",
                                   code=password_reset.code
                                   )
        mail.send(msg)
        return PasswordResetRequestMutation(success=True)


class PasswordResetMutation(graphene.Mutation):
    class Arguments:
        code = graphene.String(required=True)
        new_password = graphene.String(required=True)
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, code, new_password):
        password_reset_obj = PasswordResetModel.query.filter_by(
            code=code
        )
        if not password_reset_obj:
            raise GraphQLError("Invalid code!")
