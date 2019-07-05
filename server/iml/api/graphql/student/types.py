from iml.models import (
        Student as StudentModel,
        Team as TeamModel,
        School as SchoolModel,
        Division as DivisionModel,
        )
from graphene_sqlalchemy import SQLAlchemyObjectType

class Student(SQLAlchemyObjectType):
    class Meta:
        model = StudentModel


class Team(SQLAlchemyObjectType):
    class Meta:
        model = TeamModel

class School(SQLAlchemyObjectType):
    class Meta:
        model = SchoolModel

class Division(SQLAlchemyObjectType):
    class Meta:
        model = DivisionModel
