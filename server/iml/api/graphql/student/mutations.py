import graphene
from graphql import GraphQLError

from flask_jwt_extended import (
    jwt_required, get_current_user
)
from iml.api.graphql.student.types import (
    Student,
    School,
    Team
)
from iml.api.graphql.admin.types import (
    Division,
    Season
)
from iml.api.graphql.utils import (
    clean_input, localize_id, update_model_with_dict
)

from iml.api.graphql.wrappers import (
    require_authorization, admin_required
)
from iml.database import db
from iml.models import (
    Student as StudentModel,
    School as SchoolModel,
    Team as TeamModel,
)


class StudentUpdateInput(graphene.InputObjectType):
    first = graphene.String(description="First Name")
    last = graphene.String(description="Last Name")
    nickname = graphene.String(description="Nickname")
    graduation_year = graphene.Int(description="Graduation Year")
    current_team_id = graphene.ID(description="Permanent Team ID")
    school_id = graphene.ID(required=True, description="School ID")
    current_division_id = graphene.ID(description="Division ID")


# TODO : add viewer-checks etc, general validation
class StudentCreationInput(graphene.InputObjectType):
    first = graphene.String(required=True, description="First Name")
    last = graphene.String(required=True, description="Last Name")
    nickname = graphene.String(required=False, description="Nickname")
    graduation_year = graphene.Int(
        required=True,
        description="Graduation Year")
    school_id = graphene.ID(required=True, description="School ID")
    current_team_id = graphene.ID(required=False,
                                  description="Permanent Team ID")
    current_division_id = graphene.ID(required=True,
                                      description="Division ID")


class CreateStudentMutation(graphene.Mutation):
    class Arguments:
        studentInfo = StudentCreationInput(required=True)

    student = graphene.Field(lambda: Student)
    id = graphene.ID()

    # TODO - verification
    @classmethod
    def mutate(cls, root, info, studentInfo):
        print(studentInfo)
        studentInfo = clean_input(studentInfo)
        print(studentInfo)
        student = StudentModel(**studentInfo)
        db.session.add(student)
        db.session.commit()
        return CreateStudentMutation(student=student,
                                     id=student.id)


class UpdateStudentMutation(graphene.Mutation):
    class Arguments:
        studentInfo = StudentUpdateInput(required=True)
        id = graphene.ID(required=True)

    student = graphene.Field(lambda: Student)
    id = graphene.ID()

    @classmethod
    def mutate(cls, root, info, studentInfo, id):
        query = Student.get_query(info)
        studentInfo = clean_input(studentInfo)
        id = localize_id(id)
        studentToModify = query.get(id)
        if len(studentInfo) != 0:
            update_model_with_dict(studentToModify, studentInfo)
            db.session.commit()
        # confirmation
        studentToModify = query.get(id)
        return UpdateStudentMutation(student=studentToModify,
                                     id=id)


class CreateSchoolMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(
            required=True,
            description="Identifier for new school"
        )
        url = graphene.String(
            required=True,
            description="Used for URI/URL identification"
        )
        school_grouping_id = graphene.ID(
            required=True,
            description="ID for corresponding School Grouping"
        )
    school = graphene.Field(lambda: School)
    id = graphene.ID()

    @classmethod
    @admin_required
    def mutate(cls, root, info,
               name, url, school_grouping_id
               ):
        school = SchoolModel(name=name, url=url, groupId=school_grouping_id)
        db.session.add(school)
        db.session.commit()
        return CreateSchoolMutation(school=school)


class UpdateSchoolMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(
            required=False,
            description="Identifier for new school"
        )
        url = graphene.String(
            required=False,
            description="Used for URI/URL identification"
        )
        school_grouping_id = graphene.ID(
            required=False,
            description="ID for corresponding School Grouping"
        )
    school = graphene.Field(lambda: School)
    id = graphene.ID()

    @classmethod
    @admin_required
    def mutate(cls, root, info,
               id, **kwargs):
        query = School.get_query(info)
        id = localize_id(id)
        schoolToModify = query.get(id)
        fields = clean_input(kwargs)
        update_model_with_dict(schoolToModify, fields)
        db.session.add(schoolToModify)
        db.session.commit()
        return UpdateSchoolMutation(school=schoolToModify)


class CreateTeamMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(
            required=True,
            description="Name of new team."
        )
        school_id = graphene.ID(
            required=False,
            description="School ID (for Admins)"
        )

        division_id = graphene.ID(
            required=True,
            description="Required Division ID"
        )

    team = graphene.Field(lambda: Team)

    @classmethod
    @jwt_required
    def mutate(cls, root, info,
               name, division_id, school_id=None):
        user = get_current_user()
        if not user:
            raise GraphQLError("Invalid user!")
        if not school_id:
            school_id = user.school_id
        school_id = localize_id(school_id)
        division_id = localize_id(division_id)

        school = School.get_query(info).get(school_id)
        division = Division.get_query(info).get(division_id)
        if not school:
            raise GraphQLError("Invalid school ID!")
        if not division:
            raise GraphQLError("Invalid division ID")
        if not user.isSchoolAdmin(school):
            raise GraphQLError("Not an admin for the given school!")
        if not division:
            raise GraphQLError("Invalid division!")
        if division not in school.divisions:
            raise GraphQLError(
                "Your school does not have access to this division!"
                " Reach out to an admin to fix this.")
        # create the team
        new_team = TeamModel(name, school_id, division_id)
        db.session.add(new_team)
        db.session.commit()
        return CreateTeamMutation(team=new_team)


class UpdateTeamMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(
            required=False,
            description="Required Team ID"
        )
        name = graphene.String(
            required=False,
            description="Name of new team."
        )
        school_id = graphene.ID(
            required=False,
            description="School ID"
        )
        division_id = graphene.ID(
            required=False,
            description="Required Division ID"
        )

    team = graphene.Field(lambda: Team)

    @classmethod
    @jwt_required
    def mutate(cls, root, info, id,
               name=None, school_id=None, division_id=None):
        user = get_current_user()
        if (school_id):
            school_id = localize_id(school_id)
        id = localize_id(id)
        if (division_id):
            division_id = localize_id(division_id)
        school = School.get_query(info).get(school_id)
        division = Division.get_query(info).get(division_id)
        # get the team
        team = Team.get_query(info).get(id)
        if not user:
            raise GraphQLError("Invalid user!")
        if not team:
            raise GraphQLError("Invalid team!")
        if school_id and not school:
            raise GraphQLError("Invalid school ID!")
        if division_id and not division:
            raise GraphQLError("Invalid division ID")
        if school_id and not user.isSchoolAdmin(school):
            raise GraphQLError("Not an admin for the given school!")
        if division_id and division not in school.divisions:
            raise GraphQLError(
                "Your school does not have access to this division!"
                " Reach out to an admin to fix this.")
        if team.school_id != school.id and not user.isAdmin():
            raise GraphQLError("You cannot modify another school's team!")
        if name:
            team.name = name
        if school_id:
            if user.isAdmin() or team.school_id == school_id:
                team.school_id = school_id
            else:
                raise GraphQLError("Cannot change a team\'s"
                                   " school unless you are a coach")
        if division_id:
            team.division_id = division_id
        db.session.add(team)
        db.session.commit()
        return UpdateTeamMutation(team=team)


class SetTeamMembersMutation(graphene.Mutation):
    class Arguments:
        studentIds = graphene.List(graphene.ID)
    team = graphene.Field(lambda: Team)

    @classmethod
    @jwt_required
    def mutate(cls, root, info, studentIds):
        pass

