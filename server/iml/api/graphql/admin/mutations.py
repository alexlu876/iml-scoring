from graphene_sqlalchemy import SQLAlchemyObjectType
import graphene

from iml.api.graphql.admin.types import (
    SchoolGrouping,
    Division,
    Season
)


class CreateSchoolGroupingMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(
            required=True,
            description="Identifier for new School Grouping"
        )
        url = graphene.String(
            required=True,
            description="Used for URI/URL identification (ie oos or /nyc/)"
        )
    schoolGrouping = graphene.Field(lambda: SchoolGrouping)

    @classmethod
    def mutate(cls, root, info, name, url):
        pass
