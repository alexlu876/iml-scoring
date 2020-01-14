import graphene
from graphql import GraphQLError

from iml import db
from iml.api.graphql.student.types import (
    Student,
    School
)
from iml.api.graphql.score.types import (
    Contest,
    Score,
    Question
)
from iml.models import (
    Contest as ContestModel,
    Score as ScoreModel,
    Question as QuestionModel
)

from iml.api.graphql.utils import (
    clean_input, localize_id, update_model_with_dict
)
from iml.api.graphql.wrappers import (
    admin_required
)


class QuestionSetupInput(graphene.InputObjectType):
    question_num = graphene.Int(description="Question number",
                                required=True)
    question_string = graphene.String(
        description="The question itself, in kramdown/katex format (TBD)." +
        "Not made public unless the contest status is disabled. (Optional)",
        required=False
    )
    question_value = graphene.Int(
        description="How much the question is worth (default 1 point)",
        required=False
    )


class CreateContestMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        start_time = graphene.DateTime(
            description="When coaches are allowed to start submitting scores",
            required=True)
        team_size = graphene.Int(
            required=False,
            description="Max Team Size For the contest")
        question_count = graphene.Int(
            required=False,
            description="Number of conditions!")
        division_id = graphene.ID(
            required=True,
            description="Corresponding Division ID"
        )
        questions = graphene.List(lambda: QuestionSetupInput, required=False)

    contest = graphene.Field(lambda: Contest)

    @classmethod
    @admin_required
    def mutate(cls, root, info,
               name, start_time, division_id,
               team_size=5, question_count=6, questions=None):
        new_contest = ContestModel(name=name,
                                   start_time=start_time,
                                   question_count=question_count,
                                   team_size=team_size
                                   )
        new_contest.division_id = localize_id(division_id)
        # either use the provided questions, or generate them:
        if (not questions):
            # if not provided, use default values..
            # at this point the query is error safe
            db.session.add(new_contest)
            db.session.commit()
            for question_num in range(1, question_count+1):
                new_question = QuestionModel(
                    contest_id=new_contest.id,
                    question_num=question_num,
                    question_value=1)
                db.session.add(new_question)
                db.session.commit()
            db.session.commit()
        else:
            question_inputs = [None] * question_count
            for question in questions:
                if (question.question_num not in range(1, question_count+1)):
                    raise GraphQLError("Invalid Question number provided!")
                question_inputs[question.question_num-1] = question
            for i in range(0, question_count):
                # check if any of the questions are missing
                if not question_inputs[i]:
                    raise GraphQLError("Missing question number " + str(i+1))
            db.session.add(new_contest)
            db.session.commit()
            for question in questions:
                # if the questions arent missing
                # we can just use their non-altered version
                new_question_object = QuestionModel(
                    new_contest.id,
                    question.question_num,
                    question.question_string,
                    question.question_value)
                db.session.add(new_question_object)
                db.session.commit()
        return CreateContestMutation(new_contest)
