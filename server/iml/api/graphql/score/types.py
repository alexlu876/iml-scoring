import graphene
from iml.models import (
    Contest as ContestModel,
    Question as QuestionModel,
    Score as ScoreModel,
    Category as CategoryModel,
    ContestAttendance as ContestAttendanceModel
)
from graphene_sqlalchemy import SQLAlchemyObjectType


class Contest(SQLAlchemyObjectType):
    class Meta:
        model = ContestModel
        interfaces = (graphene.relay.Node,)


class Question(SQLAlchemyObjectType):
    class Meta:
        interfaces = (graphene.relay.Node,)
        model = QuestionModel
        exclude_fields = ("question_string",)


class Score(SQLAlchemyObjectType):
    class Meta:
        model = ScoreModel
        interfaces = (graphene.relay.Node,)


class Category(SQLAlchemyObjectType):
    class Meta:
        model = CategoryModel
        interfaces = (graphene.relay.Node,)


class ContestAttendance(SQLAlchemyObjectType):
    class Meta:
        model = ContestAttendanceModel
        interfaces = (graphene.relay.Node,)


class ScoreRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Score


class QuestionRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Question


class CategoryRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Category


class ContestRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Contest


class ContestAttendanceRelayConnection(graphene.relay.Connection):
    class Meta:
        node = ContestAttendance
