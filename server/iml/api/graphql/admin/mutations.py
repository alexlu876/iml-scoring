from graphene_sqlalchemy import SQLAlchemyObjectType
import graphene

from graphene_cerberus import validate_input
from iml.database import db

from iml.api.graphql.wrappers import (
    admin_required
)

from iml.api.graphql.utils import (
    clean_input, localize_id, update_model_with_dict
)

from iml.api.graphql.admin.types import (
    SchoolGrouping,
    Division,
    Season
)
from iml.api.graphql.admin.validators import (
    divisionMutationValidator,
    seasonMutationValidator
)
from iml.models import (
    SchoolGrouping as SchoolGroupingModel,
    Division as DivisionModel,
    Season as SeasonModel
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

    # TODO - validation
    @classmethod
    @admin_required
    def mutate(cls, root, info, name, url):
        # validate here
        schoolGrouping = SchoolGroupingModel(
            name=name,
            url=url
        )
        db.session.add(schoolGrouping)
        db.session.commit()
        return CreateSchoolGroupingMutation(schoolGrouping=schoolGrouping)


class UpdateSchoolGroupingMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(
            required=False,
            description="Identifier for new School Grouping"
        )
        url = graphene.String(
            required=False,
            description="Used for URI/URL identification (ie oos or /nyc/)"
        )
    schoolGrouping = graphene.Field(lambda: SchoolGrouping)

    # TODO - validation
    @classmethod
    @admin_required
    def mutate(cls, root, info,
               id, **kwargs):
        query = SchoolGrouping.get_query(info)
        id = localize_id(id)
        schoolGrouping = query.get(id)
        fields = clean_input(kwargs)
        update_model_with_dict(schoolGrouping, fields)
        db.session.add(schoolGrouping)
        db.session.commit()
        return UpdateSchoolGroupingMutation(schoolGrouping=schoolGrouping)


class CreateSeasonMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(
            required=True,
            description="Identifier for new Season"
        )
        url = graphene.String(
            required=True,
            description="Used for URI/URL identification (ie /"
            "fall2017 or /spring2018/)"
        )
        start_date = graphene.Date(
            required=True,
            description="Start time of the season."
        )
        end_date = graphene.Date(
            required=True,
            description="End time of the season."
        )

    season = graphene.Field(lambda: Season)
    id = graphene.ID()

    @classmethod
    @admin_required
    @validate_input(seasonMutationValidator)
    def mutate(cls, root, info,
               name, url,
               start_date, end_date):
        season = SeasonModel(
            name=name,
            url=url,
            start_date=start_date,
            end_date=end_date
        )
        db.session.add(season)
        db.session.commit()
        return CreateSeasonMutation(season=season,
                                    id=season.id)


class UpdateSeasonMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(
            required=False,
            description="Identifier for new Season"
        )
        url = graphene.String(
            required=False,
            description="Used for URI/URL identification (ie /"
            "fall2017 or /spring2018/)"
        )
        start_date = graphene.Date(
            required=False,
            description="Start time of the season."
        )
        end_date = graphene.Date(
            required=False,
            description="End time of the season."
        )

    season = graphene.Field(lambda: Season)
    id = graphene.ID()

    @classmethod
    # @admin_required
    @validate_input(seasonMutationValidator)
    def mutate(cls, root, info, id, **kwargs):
        query = Season.get_query(info)
        id = localize_id(id)
        seasonToModify = query.get(id)
        fields = clean_input(kwargs)
        update_model_with_dict(seasonToModify, fields)
        db.session.add(seasonToModify)
        db.session.commit()
        return UpdateSeasonMutation(season=seasonToModify,
                                    id=id)


class CreateDivisionMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(
            required=True,
            description="Identifier for new Season"
        )
        url = graphene.String(
            required=True,
            description="Used for URI/URL identification (ie /"
            "fall2017 or /spring2018/)"
        )
        alternate_limit = graphene.Int(
            required=True,
            description="How many alternatives can be used per division-school"
        )
        season_id = graphene.ID(
            required=True,
            description="ID for Corresponding season"
        )
        successor_id = graphene.ID(
            required=False,
            description="ID for new Division to feed users into at season end."
        )
    division = graphene.Field(lambda: Division)

    @classmethod
    @admin_required
    @validate_input(divisionMutationValidator)
    def mutate(cls, root, info,
               name, url, alternate_limit,
               season_id, successor_id=None):
        division = DivisionModel(
            name=name,
            url=url,
            alternate_limit=alternate_limit,
            season_id=season_id,
            successor_id=successor_id
        )
        db.session.add(division)
        db.session.commit()
        return CreateDivisionMutation(division=division)


class UpdateDivisionMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(
            required=False,
            description="Identifier for new Season"
        )
        url = graphene.String(
            required=False,
            description="Used for URI/URL identification (ie /"
            "fall2017 or /spring2018/)"
        )
        alternate_limit = graphene.Int(
            required=False,
            description="How many alternatives can be used per division-school"
        )
        season_id = graphene.ID(
            required=False,
            description="ID for Corresponding season"
        )
        successor_id = graphene.ID(
            required=False,
            description="ID for new Division to feed users into at season end."
        )
    division = graphene.Field(lambda: Division)

    @classmethod
    @admin_required
    @validate_input(divisionMutationValidator)
    def mutate(cls, root, info, id, **kwargs):
        query = Division.get_query(info)
        id = localize_id(id)
        divisionToModify = query.get(id)
        fields = clean_input(kwargs)
        update_model_with_dict(divisionToModify, fields)
        db.session.add(divisionToModify)
        db.session.commit()
        return UpdateDivisionMutation(division=divisionToModify)
