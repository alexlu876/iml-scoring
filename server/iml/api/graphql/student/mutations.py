import graphene
from iml.api.graphql.student.types import (
    Student,
    School
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
    School as SchoolModel
)


class StudentUpdateInput(graphene.InputObjectType):
    first = graphene.String(description="First Name")
    last = graphene.String(description="Last Name")
    nickname = graphene.String(description="Nickname")
    graduation_year = graphene.Int(description="Graduation Year")
    team_id = graphene.ID(description="Permanent Team ID")
    school_id = graphene.ID(required=True, description="School ID")
    division_id = graphene.ID(description="Division ID")


# TODO : add viewer-checks etc, general validation
class StudentCreationInput(graphene.InputObjectType):
    first = graphene.String(required=True, description="First Name")
    last = graphene.String(required=True, description="Last Name")
    nickname = graphene.String(required=False, description="Nickname")
    graduation_year = graphene.Int(
        required=True,
        description="Graduation Year")
    school_id = graphene.ID(required=True, description="School ID")
    team_id = graphene.ID(required=False, description="Permanent Team ID")
    division_id = graphene.ID(required=True, description="Division ID")


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

