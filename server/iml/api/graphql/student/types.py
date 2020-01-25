from iml.models import (
    Student as StudentModel,
    Team as TeamModel,
    School as SchoolModel,
    StudentDivisionAssociation as StudentDivisionAssociationModel
)
from graphene_sqlalchemy import SQLAlchemyObjectType
import graphene


class Student(SQLAlchemyObjectType):
    class Meta:
        model = StudentModel
        interfaces = (graphene.relay.Node,)


class StudentRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Student


class Team(SQLAlchemyObjectType):
    class Meta:
        model = TeamModel
        interfaces = (graphene.relay.Node,)


class TeamRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Team
        interfaces = (graphene.relay.Node,)


class School(SQLAlchemyObjectType):
    class Meta:
        model = SchoolModel
        interfaces = (graphene.relay.Node,)


class SchoolRelayConnection(graphene.relay.Connection):
    class Meta:
        node = School
        interfaces = (graphene.relay.Node,)


class StudentDivisionAssociation(SQLAlchemyObjectType):
    class Meta:
        model = StudentDivisionAssociationModel
        interfaces = (graphene.relay.Node,)
    is_alternate = graphene.Boolean()


class StudentDivisionAssociationRelayConnection(graphene.relay.Connection):
    class Meta:
        node = StudentDivisionAssociation
        interfaces = (graphene.relay.Node,)

