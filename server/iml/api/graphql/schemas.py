import graphene
from graphene import relay

from graphql import GraphQLError
from graphene_sqlalchemy import (
    SQLAlchemyObjectType,
    SQLAlchemyConnectionField
)
from flask_jwt_extended import (
        create_access_token, create_refresh_token,
        jwt_refresh_token_required, get_jwt_identity,
        jwt_required, jwt_optional, get_current_user
        )

from iml.api.graphql.utils import localize_id

from iml.api.graphql.user.types import (
    User, UserRelayConnection
)
from iml.api.graphql.user.mutations import (
    AdminCreationMutation, UserRegisterMutation
)
from iml.api.graphql.admin.types import (
    SchoolGrouping,
    Division,
    Season,
    SchoolGroupingRelayConnection,
    DivisionRelayConnection,
    SeasonRelayConnection
)
from iml.api.graphql.student.types import (
    Student,
    Team,
    School,
    StudentRelayConnection,
    TeamRelayConnection,
    SchoolRelayConnection
)
from iml.api.graphql.score.types import (
    Score, Question, Contest
)

from iml.api.graphql.student.mutations import (
    CreateStudentMutation, UpdateStudentMutation
)
from iml.api.graphql.admin.mutations import (
    CreateSeasonMutation,
    CreateDivisionMutation,
    CreateSchoolGroupingMutation
)


class Query(graphene.ObjectType):
    node = relay.Node.Field()

    users = SQLAlchemyConnectionField(UserRelayConnection)
    user = graphene.Field(lambda: User,
                          id=graphene.ID(required=True))
    viewer = graphene.Field(lambda: User)

    schools = SQLAlchemyConnectionField(SchoolRelayConnection)
    school = graphene.Field(lambda: School,
                            id=graphene.ID(required=True))

    students = SQLAlchemyConnectionField(StudentRelayConnection)
    student = graphene.Field(lambda: Student, id=graphene.ID(required=True))

    divisions = SQLAlchemyConnectionField(DivisionRelayConnection)
    division = graphene.Field(lambda: Division, id=graphene.ID(required=True))

    def resolve_user(root, info, id):
        query = User.get_query(info)
        return query.get(localize_id(id))

    def resolve_school(root, info, id):
        query = School.get_query(info)
        return query.get(localize_id(id))

    def resolve_student(root, info, id):
        query = Student.get_query(info)
        return query.get(localize_id(id))

    def resolve_division(root, info, id):
        query = Division.get_query(info)
        return query.get(localize_id(id))

    @jwt_optional
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
        query = User.get_query(info)
        user = query.filter_by(email=email).first()
        if (user and user.checkPassword(password)):
            return AuthMutation(
                accessToken=create_access_token(
                    identity=email, fresh=True),
                refreshToken=create_refresh_token(email)
            )
        return GraphQLError("Invalid Login!")


class RefreshMutation(graphene.Mutation):
    newAccessToken = graphene.String()

    @classmethod
    @jwt_refresh_token_required
    def mutate(cls, root, info):
        user_identity = get_jwt_identity()
        if not user_identity:
            return None
        return RefreshMutation(
                newAccessToken=create_access_token(
                    identity=user_identity,
                    fresh=False)
                )


class Mutation(graphene.ObjectType):
    auth = AuthMutation.Field()
    refresh = RefreshMutation.Field()
    createAdmin = AdminCreationMutation.Field()
    register = UserRegisterMutation.Field()

    createStudent = CreateStudentMutation.Field()
    updateStudent = UpdateStudentMutation.Field()

    createDivision = CreateDivisionMutation.Field()


gql_schema = graphene.Schema(query=Query, mutation=Mutation)
