import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from flask_jwt_extended import (
        create_access_token, create_refresh_token,
        jwt_refresh_token_required, get_jwt_identity,
        jwt_required, get_current_user
        )
from iml.models import User, Student, Team, School, Division, Contest, Question, Score


class UserGQL(SQLAlchemyObjectType):
    class Meta:
        model = User
        exclude_fields=("password",)

class StudentGQL(SQLAlchemyObjectType):
    class Meta:
        model = Student

class TeamGQL(SQLAlchemyObjectType):
    class Meta:
        model = Team


class SchoolGQL(SQLAlchemyObjectType):
    class Meta:
        model = School

class DivisionGQL(SQLAlchemyObjectType):
    class Meta:
        model = Division


class ContestGQL(SQLAlchemyObjectType):
    class Meta:
        model = Contest


class QuestionGQL(SQLAlchemyObjectType):
    class Meta:
        model = Question


class ScoreGQL(SQLAlchemyObjectType):
    class Meta:
        model = Score


class Query(graphene.ObjectType):
    users = graphene.List(UserGQL)
    user = graphene.Field(lambda: UserGQL, id = graphene.Int())
    viewer = graphene.Field(lambda: UserGQL)

    schools = graphene.List(SchoolGQL)
    school = graphene.Field(lambda:SchoolGQL, id = graphene.Int())

    def resolve_users(self, info, **kwargs):
        query = UserGQL.get_query(info)
        return query.filter_by(**kwargs)

    def resolve_schools(self,info, **kwargs):
        query = SchoolGQL.get_query(info)
        return query.filter_by(**kwargs)

    def resolve_user(root, info, id):
        query = UserGQL.get_query(info)
        return query.filter(User.id == id).first()

    @jwt_required
    def resolve_viewer(root, info):
        return get_current_user()

class AuthMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    accessToken = graphene.String()
    refreshToken = graphene.String()

    @classmethod
    def mutate(cls, root, info, email, password):
        user = User.query.filter_by(email=email).first()
        if (user and user.checkPassword(password)):
            return AuthMutation(
                    accessToken = create_access_token(email),
                    refreshToken= create_refresh_token(email)
                    )
        return None

class RefreshMutation(graphene.Mutation):
    newAccessToken = graphene.String()

    @classmethod
    @jwt_refresh_token_required
    def mutate(cls, root, info):
        user_identity = get_jwt_identity()
        if not user_identity:
            return None
        return RefreshMutation(
                newAccessToken = create_access_token(user_identity)
                )

class Mutation(graphene.ObjectType):
    auth = AuthMutation.Field()
    refresh = RefreshMutation.Field()

gql_schema = graphene.Schema(query=Query, mutation=Mutation)
