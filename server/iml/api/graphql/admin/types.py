from iml.models import (
    Division as DivisionModel,
    SchoolGrouping as SchoolGroupingModel,
    Season as SeasonModel
)

from graphene_sqlalchemy import SQLAlchemyObjectType
import graphene


class SchoolGrouping(SQLAlchemyObjectType):
    class Meta:
        model = SchoolGroupingModel
        interfaces = (graphene.relay.Node,)


class SchoolGroupingRelayConnection(graphene.relay.Connection):
    class Meta:
        node = SchoolGrouping
        interfaces = (graphene.relay.Node,)


class Division(SQLAlchemyObjectType):
    class Meta:
        model = DivisionModel
        interfaces = (graphene.relay.Node,)


class DivisionRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Division
        interfaces = (graphene.relay.Node,)


class Season(SQLAlchemyObjectType):
    class Meta:
        model = SeasonModel
        interfaces = (graphene.relay.Node,)


class SeasonRelayConnection(graphene.relay.Connection):
    class Meta:
        node = Season
        interfaces = (graphene.relay.Node,)

