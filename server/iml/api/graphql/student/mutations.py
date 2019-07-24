import graphene
from iml.api.graphql.student.types import Student
from iml.api.graphql.utils import clean_input

from iml.database import db
from iml.models import Student as StudentModel


class StudentUpdateInput(graphene.InputObjectType):
    first = graphene.String(description = "First Name")
    last = graphene.String(description = "Last Name")
    nickname = graphene.String(description = "Nickname")
    graduation_year = graphene.Int(description = "Graduation Year")
    team_id = graphene.ID(description = "Permanent Team ID")

#TODO : add viewer-checks etc, general validation
class StudentCreationInput(graphene.InputObjectType):
    first = graphene.String(required = True, description = "First Name")
    last = graphene.String(required = True, description = "Last Name")
    nickname = graphene.String(required = False, description = "Nickname")
    graduation_year = graphene.Int(required = True, description = "Graduation Year")
    school_id = graphene.ID(required = True, description = "School ID")
    team_id = graphene.ID(required = False, description = "Permanent Team ID")



class CreateStudentMutation(graphene.Mutation):
    class Arguments:
        studentInfo = StudentCreationInput(required=True)

    student = graphene.Field(lambda:Student)

    #TODO - verification
    @classmethod
    def mutate(cls, root, info, studentInfo):
        studentInfo = clean_input(studentInfo)
        student = StudentModel(**studentInfo)
        db.session.add(student)
        db.session.commit()
        return CreateStudentMutation(student)


class UpdateStudentMutation(graphene.Mutation):
    class Arguments:
        studentInfo = StudentUpdateInput

    student = graphene.Field(lambda:Student)

    @classmethod
    def mutate(cls, root, info, studentInfo):
        studentInfo = clean_input(studentInfo)
        print(studentInfo)
        return None
