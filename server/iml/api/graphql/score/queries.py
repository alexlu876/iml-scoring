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


class ScoreQueries(graphene.ObjectType):
    simple_score_by_contest = graphene.List(
        SimpleScore,
        contest_id=graphene.ID(required=True),
        student_id=graphene.ID(required=True)
    )

    def resolve_simple_score_by_contest(parent, info,
                                        contest_id, student_id):
        scores = Score.get_query(info).filter_by(
            student_id=student_id).filter(
                ScoreModel.question.has(contest_id=contest_id)).all()
        return scores.map(lambda score: {
            'question_num': score.question.question_num,
            'points_awarded': score.points_awarded
        })
