import graphene
from iml.models import (
    Contest as ContestModel,
    Question as QuestionModel,
    Score as ScoreModel,
    Category as CategoryModel
)
from graphene_sqlalchemy import SQLAlchemyObjectType


class Contest(SQLAlchemyObjectType):
    class Meta:
        model = ContestModel


class Question(SQLAlchemyObjectType):
    class Meta:
        model = QuestionModel
        exclude_fields = ("question_string",)


class Score(SQLAlchemyObjectType):
    class Meta:
        model = ScoreModel


class Category(SQLAlchemyObjectType):
    class Meta:
        model = CategoryModel


class ScoreRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Score
        interfaces = (graphene.relay.Node,)


class QuestionRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Question
        interfaces = (graphene.relay.Node,)


class CategoryRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Category
        interfaces = (graphene.relay.Node,)


class ContestRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Contest
        interfaces = (graphene.relay.Node,)
