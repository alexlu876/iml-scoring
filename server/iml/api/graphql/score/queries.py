import graphene
from graphql import GraphQLError
from graphene_sqlalchemy import (
    SQLAlchemyConnectionField
)
from iml.api.graphql.utils import localize_id
from iml.api.graphql.student.types import (
    Student, StudentRelayConnection
)
from iml.api.graphql.score.types import (
    Score,
    ScoreRelayConnection
)


class ContestScores(graphene.ObjectType):
    scores = SQLAlchemyConnectionField(ScoreRelayConnection)
    student = SQLAlchemyConnectionField()


class ScoreQueries(graphene.ObjectType):
    scores_by_contest = graphene.Field(ContestScores)


