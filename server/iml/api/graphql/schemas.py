import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
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



gql_schema = graphene.Schema(query=Query)
