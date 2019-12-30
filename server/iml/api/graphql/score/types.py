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


class Score(SQLAlchemyObjectType):
    class Meta:
        model = ScoreModel


class Category(SQLAlchemyObjectType):
    class Meta:
        model = CategoryModel
