import graphene
from typing import Union, List
from graphql import GraphQLError
from datetime import datetime

from flask_jwt_extended import (
    jwt_required, get_current_user
)

from iml import db
from iml.api.graphql.student.types import (
    Student,
    School,
    Team
)
from iml.api.graphql.score.types import (
    Contest,
    Score,
    ScoreRelayConnection,
    Question,
    ContestAttendance
)
from iml.models import (
    Contest as ContestModel,
    Score as ScoreModel,
    Question as QuestionModel,
    ContestAttendance as ContestAttendanceModel,
    Student as StudentModel,
    User as UserModel,
    StudentDivisionAssociation as StudentDivisionAssociationModel,
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


class UpdateContestAttendanceMutation(graphene.Mutation):
    class Arguments:
        student_id = graphene.ID(required=True)
        contest_id = graphene.ID(required=True)
        team_id = graphene.ID(required=False)
        attended = graphene.Boolean(required=True)
    attendance = graphene.Field(lambda: ContestAttendance)

    @classmethod
    @jwt_required
    def mutate(cls, root, info,
               student_id, contest_id, attended, team_id=None):
        user = get_current_user()
        student_id = localize_id(student_id)
        contest_id = localize_id(contest_id)
        team_id = localize_id(team_id)

        student = Student.get_query(info).get(student_id)
        contest = Contest.get_query(info).get(contest_id)
        team = Team.get_query(info).get(team_id)
        if not user:
            raise GraphQLError("Invalid user!")
        if not student:
            raise GraphQLError("Invalid student!")
        if not contest:
            raise GraphQLError("Invalid contest!")
        if not user.isSchoolAdmin(student.school):
            raise GraphQLError("Not an admin for given school!")
        school = student.school
        if contest.division not in school.divisions:
            raise GraphQLError(
                "This contest is not available to the given school!")
        if student.current_division != contest.division:
            raise GraphQLError(
                "This student cannot participate in the given contest!")
        if team_id and not attended:
            raise GraphQLError(
                "You cannot be absent while substituting in for a team!")
        if not team_id:
            return UpdateContestAttendanceMutation(
                attendance=update_attendance(
                    info,
                    coach_id=user.id,
                    contest_id=contest_id,
                    student_id=student_id,
                    attended=attended,
                    team_id=team_id
                )
            )
        # if not attended:
        #     # do not allow changing to "not attended if scores exist"
        #     scores = db.session.query(ScoreModel).filter_by(
        #         student_id=student_id,
        #     ).filter(ScoreModel.question.has(
        #         contest_id=contest_id))
        #     if scores and scores.count() <= 0:
        #         raise GraphQLError("Remove scores first!")
        if not team:
            raise GraphQLError("Invalid team!")
        if team.school != school:
            raise GraphQLError("You don't control this team!")
        if attended and not student.current_team_id:
            division_assoc = StudentDivisionAssociationModel.query.filter_by(
                student_id=student.id,
                division_id=contest.division_id).first()
            if not division_assoc or not division_assoc.is_alternate:
                raise GraphQLError("Student not an alternate!")
            for student in team.current_students:
                if not ContestAttendance.get_query(info).filter_by(
                    contest_id=contest_id,
                    student_id=student.id
                ).first():
                    raise GraphQLError("Update regular students status first!")
            # end loop

        participants = ContestAttendance.get_query(info).filter_by(
            contest_id=contest_id,
            team_id=team_id,
            attended=True
        )
        if (participants.count() >= contest.team_size and
                not participants.filter_by(student_id=student_id).first()):
            raise GraphQLError("This team already has too many participants!")
        return UpdateContestAttendanceMutation(
            attendance=update_attendance(
                info,
                coach_id=user.id,
                contest_id=contest_id,
                student_id=student_id,
                attended=attended,
                team_id=team_id
            )
        )


def update_attendance(info, coach_id, contest_id,
                      student_id, attended, team_id):
    if (not attended):
        # delete scores if attendance is removed..
        scores = db.session.query(ScoreModel).filter_by(
            student_id=student_id,
        ).filter(ScoreModel.question.has(
            contest_id=contest_id))
        scores.delete(synchronize_session='fetch')
        db.session.commit()

    attendance = ContestAttendance.get_query(info).get(
        {"contest_id": contest_id, "student_id": student_id})
    new_attendance_used = False
    if (attendance is None):
        attendance = ContestAttendanceModel(
            contest_id=contest_id,
            student_id=student_id,
            attended=attended,
            team_id=team_id
        )
        new_attendance_used = True

    if (attended and (new_attendance_used or not attendance.attended)):
        # if a new attendance object is generated or the status was changed
        # from not attended to attended,
        # put in 0-scores for default.
        contest = Contest.get_query(info).get(contest_id)
        old_scores = Score.get_query(info).filter_by(
            student_id=student_id
        ).filter(ScoreModel.question.has(
                contest_id=contest_id)
        )
        print(old_scores.count())
        if old_scores.count() <= 0:
            print("Adding 0-scores!")
            scores = [
                ScoreModel(
                    question_id=contest.getQuestion(i+1).id,
                    points_awarded=0,
                    timestamp=datetime.utcnow(),
                    team_id=team_id,
                    coach_id=coach_id,
                    student_id=student_id) for i in range(
                        contest.question_count)]
            db.session.bulk_save_objects(scores)
            db.session.commit()

    attendance.attended = attended
    attendance.team_id = team_id
    # update the scores for this contest with the new team_id,
    # if they exist:
    db.session.query(ScoreModel).filter_by(
        student_id=student_id,
    ).filter(ScoreModel.question.has(
        contest_id=contest_id)).update(
            {'team_id': team_id},
            synchronize_session='fetch'
        )
    db.session.commit()
    db.session.add(attendance)
    db.session.commit()
    return attendance


class ScoreInput(graphene.InputObjectType):
    question_num = graphene.Int(description="Question number",
                                required=True)
    points_awarded = graphene.Int(description="Score on given question",
                                  required=True)


def partially_validate_score_entry(info, user, student, contest):
    if not user:
        raise GraphQLError("Invalid user!")
    if not student:
        raise GraphQLError("Invalid student!")
    if not contest:
        raise GraphQLError("Invalid contest!")
    if not user.isSchoolAdmin(student.school):
        raise GraphQLError("Not an admin for given school!")
    school = student.school
    if contest.division not in school.divisions:
        raise GraphQLError(
            "This contest is not available to the given school!")
    if student.current_division != contest.division:
        raise GraphQLError(
            "This student cannot participate in the given contest!")
    attendance = ContestAttendance.get_query(info).get(
        {"student_id": student.id, "contest_id": contest.id}
    )
    if not (attendance and attendance.attended):
        raise GraphQLError("This student did not attend this contest!")
    return True


class UpdateScoreMutation(graphene.Mutation):
    class Arguments:
        scores = graphene.List(ScoreInput)
        contest_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)
    scores = graphene.relay.ConnectionField(
        ScoreRelayConnection
    )

    @classmethod
    @jwt_required
    def mutate(cls, root, info, scores, student_id, contest_id):
        user = get_current_user()
        student_id = localize_id(student_id)
        contest_id = localize_id(contest_id)

        student = Student.get_query(info).get(student_id)
        contest = Contest.get_query(info).get(contest_id)
        partially_validate_score_entry(info, user, student, contest)
        attendance = ContestAttendance.get_query(info).get(
            {"student_id": student.id, "contest_id": contest.id}
        )
        team_id = attendance.team_id
        # dealing with whether team is provided, and that
        # attendance/alternate confirmation rules have bene followed
        # is the duty of the attendance setting mutation
        return UpdateScoreMutation(
            update_scores(student, contest, user,
                          team_id, scores))


class DeleteScoreMutation(graphene.Mutation):
    class Arguments:
        contest_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)
    success = graphene.Boolean()

    @classmethod
    @jwt_required
    def mutate(cls, root, info, student_id, contest_id):
        user = get_current_user()
        student_id = localize_id(student_id)
        contest_id = localize_id(contest_id)
        student = Student.get_query(info).get(student_id)
        contest = Contest.get_query(info).get(contest_id)

        partially_validate_score_entry(info, user, student, contest)
        scores = db.session.query(ScoreModel).filter_by(
            student_id=student_id,
        ).filter(ScoreModel.question.has(
            contest_id=contest_id))
        scores.delete(synchronize_session='fetch')
        db.session.commit()
        return DeleteScoreMutation(True)


def update_scores(student: StudentModel,
                  contest: ContestModel, coach: UserModel,
                  team_id: Union[int, None],
                  scores_input: List[ScoreInput]):
    # validate scores_input to make sure no questions or
    # keys are missing/out of bounds.
    question_count = contest.question_count
    scores = [None] * question_count
    for entry in scores_input:
        if (entry.question_num not in range(1, question_count+1)):
            raise GraphQLError("Invalid Question number provided!")
        question_object = contest.getQuestion(entry.question_num)
        if (entry.points_awarded < 0
                or entry.points_awarded > question_object.getMaxScore()):
            raise GraphQLError(
                "Invalid score value for question " + str(entry.question_num))
        scores[entry.question_num-1] = entry.points_awarded
    for i in range(0, question_count):
        # check if any of the questions are missing
        if scores[i] is None:
            raise GraphQLError("Missing question number " + str(i+1))
    # at this point, scores are properly formatted, and all exist.
    scores_list = []
    for i in range(0, question_count):
        question_object = QuestionModel.query.filter_by(
            question_num=i+1, contest_id=contest.id).first()
        if not question_object:
            raise GraphQLError("Question not correctly set up!")
        old_score_object = ScoreModel.query.filter_by(
            student_id=student.id,
            question_id=question_object.id).first()
        if (old_score_object):
            old_score_object.coach_id = coach.id
            old_score_object.timestamp = datetime.utcnow()
            old_score_object.team_id = team_id
            old_score_object.points_awarded = scores[i]
            db.session.add(old_score_object)
            db.session.commit()
            scores_list.append(old_score_object)
        else:
            new_score_object = ScoreModel(
                question_id=question_object.id,
                points_awarded=scores[i],
                timestamp=datetime.utcnow(),
                team_id=team_id,
                coach_id=coach.id,
                student_id=student.id)
            db.session.add(new_score_object)
            db.session.commit()
            scores_list.append(new_score_object)
    return scores_list
