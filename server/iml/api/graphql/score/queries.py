import graphene
from graphql import GraphQLError
from graphene_sqlalchemy import (
    SQLAlchemyConnectionField
)
from iml.api.graphql.utils import localize_id
from iml.models import (
    Score as ScoreModel
)
from iml.api.graphql.student.types import (
    Student, StudentRelayConnection
)
from iml.api.graphql.score.types import (
    Score,
    ScoreRelayConnection
)


class SimpleScore(graphene.ObjectType):
    question_num = graphene.Int(required=True)
    points_awarded = graphene.Int(required=True)

