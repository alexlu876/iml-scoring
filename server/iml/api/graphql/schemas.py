import graphene
from graphene import relay
import datetime

from graphql import GraphQLError
from graphene_sqlalchemy import (
    SQLAlchemyConnectionField
)
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_refresh_token_required, get_jwt_identity,
    jwt_required, jwt_optional, get_current_user
)

from iml.api.graphql.utils import localize_id

from iml.models import (
    School as SchoolModel,
    Season as SeasonModel,
    Student as StudentModel,
    StudentDivisionAssociation as StudentDivisionAssociationModel,
    Score as ScoreModel
)

from iml.api.graphql.user.types import (
    User, UserRelayConnection
)
from iml.api.graphql.user.mutations import (
    AdminCreationMutation,
    UserRegisterMutation,
    CodeCreationMutation,
    PasswordResetRequestMutation,
    PasswordResetMutation,
)
from iml.api.graphql.score.queries import (
    SimpleScore
)
from iml.api.graphql.admin.types import (
    SchoolGrouping,
    Division,
    Season,
    SchoolGroupingRelayConnection,
    DivisionRelayConnection,
    SeasonRelayConnection
)
from iml.api.graphql.student.types import (
    Student,
    Team,
    School,
    StudentRelayConnection,
    TeamRelayConnection,
    SchoolRelayConnection,
    StudentDivisionAssociation
)
from iml.api.graphql.score.types import (
    Score, Question, Contest, ScoreRelayConnection,
    ContestRelayConnection, QuestionRelayConnection,
    ContestAttendance, ContestAttendanceRelayConnection, Category
)

from iml.api.graphql.student.mutations import (
    CreateStudentMutation,
    UpdateStudentMutation,
    CreateSchoolMutation,
    UpdateSchoolMutation,
    CreateTeamMutation,
    UpdateTeamMutation,
    SetTeamMembersMutation,
)
from iml.api.graphql.score.mutations import (
    CreateContestMutation,
    UpdateContestAttendanceMutation,
    UpdateScoreMutation,
    DeleteScoreMutation
)
from iml.api.graphql.admin.mutations import (
    CreateSeasonMutation,
    CreateDivisionMutation,
    CreateSchoolGroupingMutation,
    UpdateSeasonMutation,
    UpdateDivisionMutation,
    UpdateSchoolGroupingMutation,
    AddDivisionToSchoolMutation
)


class Query(graphene.ObjectType):
    node = relay.Node.Field()

    users = SQLAlchemyConnectionField(UserRelayConnection)
    user = graphene.Field(lambda: User,
                          id=graphene.ID(required=True))
    viewer = graphene.Field(lambda: User)
    viewer_school = graphene.Field(lambda: School)
    viewer_students = SQLAlchemyConnectionField(StudentRelayConnection)
    viewer_students_by_contest = graphene.relay.ConnectionField(
        StudentRelayConnection,
        contest_id=graphene.ID(required=True)
    )
    student_is_alternate = graphene.Field(
        graphene.Boolean,
        contest_id=graphene.ID(required=True),
        student_id=graphene.ID(required=True)
    )
    viewer_attendees_by_contest = graphene.relay.ConnectionField(
        StudentRelayConnection,
        contest_id=graphene.ID(required=True)
    )
    contests = SQLAlchemyConnectionField(ContestRelayConnection)
    contest = graphene.Field(lambda: Contest, id=graphene.ID(required=True))
    students = SQLAlchemyConnectionField(StudentRelayConnection)
    student = graphene.Field(lambda: Student, id=graphene.ID(required=True))
    no_team_students = graphene.relay.ConnectionField(
        StudentRelayConnection,
        division_id=graphene.ID(required=True),
        school_id=graphene.ID(required=True)
    )
    team_current_students = graphene.relay.ConnectionField(
        StudentRelayConnection,
        team_id=graphene.ID(required=True)
    )
    student_contest_attendance = graphene.Field(
        lambda: ContestAttendance,
        contest_id=graphene.ID(required=True),
        student_id=graphene.ID(required=True)
    )

    scores = SQLAlchemyConnectionField(ScoreRelayConnection)

    scores_by_contest = graphene.relay.ConnectionField(
        ScoreRelayConnection,
        contest_id=graphene.ID(required=True),
        student_id=graphene.ID(required=True)
    )

    schools = SQLAlchemyConnectionField(SchoolRelayConnection)
    school = graphene.Field(lambda: School,
                            id=graphene.ID(required=True))

    divisions = SQLAlchemyConnectionField(DivisionRelayConnection)
    division = graphene.Field(lambda: Division, id=graphene.ID(required=True))
    division_by_url = graphene.Field(lambda: Division, url=graphene.String(
        required=True), season_url=graphene.String(required=False))

    seasons = SQLAlchemyConnectionField(SeasonRelayConnection)
    season = graphene.Field(lambda: Season, id=graphene.ID(required=True))
    current_season = graphene.Field(lambda: Season)

    school_groupings = SQLAlchemyConnectionField(SchoolGroupingRelayConnection)

    simple_score_by_contest = graphene.List(
        SimpleScore,
        contest_id=graphene.ID(required=True),
        student_id=graphene.ID(required=True)
    )

    def resolve_simple_score_by_contest(root, info,
                                        contest_id, student_id):
        contest_id = localize_id(contest_id)
        student_id = localize_id(student_id)
        scores = Score.get_query(info).filter_by(
            student_id=student_id).filter(
                ScoreModel.question.has(contest_id=contest_id)).all()
        return map((lambda score: {
            'question_num': score.question.question_num,
            'points_awarded': score.points_awarded
        }), scores)

    def resolve_user(root, info, id):
        query = User.get_query(info)
        return query.get(localize_id(id))

    def resolve_school(root, info, id):
        query = School.get_query(info)
        return query.get(localize_id(id))

    def resolve_student(root, info, id):
        query = Student.get_query(info)
        return query.get(localize_id(id))

    def resolve_no_team_students(root, info, division_id, school_id):
        return Student.get_query(info).filter_by(
            school_id=school_id,
            current_division_id=division_id,
            current_team_id=None).all()

    def resolve_team_current_students(root, info, team_id):
        return Student.get_query(info).filter_by(
            current_team_id=team_id
        ).all()

    def resolve_division(root, info, id):
        query = Division.get_query(info)
        return query.get(localize_id(id))

    def resolve_division_by_url(root, info, url, season_url=None):
        query = Division.get_query(info)
        divisions = query.filter_by(url=url)
        if season_url:
            season = Season.get_query(info).filter_by(
                season_url=season_url).first()
            if not season:
                raise GraphQLError("Invalid season!")
            divisions = divisions.filter_by(season_id=season.id)
        return divisions.first()

    def resolve_season(root, info, id):
        query = Season.get_query(info)
        return query.get(localize_id(id))

    def resolve_contest(root, info, id):
        return Contest.get_query(info).get(localize_id(id))

    @jwt_optional
    def resolve_viewer(root, info):
        return get_current_user()

    @jwt_optional
    def resolve_viewer_school(root, info):
        user = get_current_user()
        return user.school if user else None

    @jwt_optional
    def resolve_viewer_students(root, info, *args, **kwargs):
        user = get_current_user()
        return user.students if user else None

    @jwt_required
    def resolve_viewer_students_by_contest(root, info, contest_id, **kwargs):
        user = get_current_user()
        contest = Contest.get_query(info).get(localize_id(contest_id))
        if not contest:
            raise GraphQLError("Invalid contest provided!")
        return Student.get_query(info).filter_by(
            current_division_id=contest.division_id,
            school_id=user.school_id
        ).join(
            StudentDivisionAssociationModel,
            StudentModel.current_division_assoc
        ).order_by(StudentModel.current_team_id.desc(),
                   StudentDivisionAssociationModel.is_alternate.desc(),
                   StudentModel.username).all()

    @jwt_required
    def resolve_viewer_attendees_by_contest(root, info, contest_id, **kwargs):
        user = get_current_user()
        contest = Contest.get_query(info).get(localize_id(contest_id))
        if not contest:
            raise GraphQLError("Invalid contest provided!")
        return Student.get_query(info).filter_by(
            school_id=user.school_id
        ).filter(
            StudentModel.attendance.any(contest_id=contest.id,
                                        attended=True)
        ).order_by(StudentModel.current_team_id.desc(),
                   StudentModel.username).all()

    def resolve_school_grouping(root, info):
        query = SchoolGrouping.get_query(info)
        return query.get(localize_id(id))

    def resolve_current_season(root, info):
        query = Season.get_query(info)
        current_time = datetime.datetime.utcnow().date()
        return query.filter(SeasonModel.start_date <= current_time,
                            SeasonModel.end_date >= current_time).first()

    def resolve_student_contest_attendance(root, info, contest_id, student_id):
        return ContestAttendance.get_query(info).get({
            'contest_id': localize_id(contest_id),
            'student_id': localize_id(student_id)
             })

    def resolve_student_is_alternate(root, info, contest_id, student_id):
        contest = Contest.get_query(info).get(contest_id)
        if not contest:
            raise GraphQLError("Invalid contest!")
        return StudentDivisionAssociation.get_query(info).filter_by(
            division_id=contest.division_id,
            student_id=student_id,
            is_alternate=True).first() is not None

    def resolve_scores_by_contest(root, info, contest_id, student_id):
        return Score.get_query(info).filter_by(
            contest_id=contest_id,
            student_id=student_id).all()


class AuthMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    accessToken = graphene.String()
    refreshToken = graphene.String()

    @classmethod
    def mutate(cls, root, info, email, password):
        query = User.get_query(info)
        user = query.filter_by(email=email).first()
        if (user and user.checkPassword(password)):
            return AuthMutation(
                accessToken=create_access_token(
                    identity=email, fresh=True),
                refreshToken=create_refresh_token(email)
            )
        return GraphQLError("Invalid Login!")


class RefreshMutation(graphene.Mutation):
    newAccessToken = graphene.String()

    @classmethod
    @jwt_refresh_token_required
    def mutate(cls, root, info):
        user_identity = get_jwt_identity()
        if not user_identity:
            return None
        return RefreshMutation(
                newAccessToken=create_access_token(
                    identity=user_identity,
                    fresh=False)
                )


class Mutation(graphene.ObjectType):
    auth = AuthMutation.Field()
    refresh = RefreshMutation.Field()

    createCode = CodeCreationMutation.Field()
    createAdmin = AdminCreationMutation.Field()
    register = UserRegisterMutation.Field()
    passwordResetRequest = PasswordResetRequestMutation.Field()
    passwordReset = PasswordResetMutation.Field()

    createStudent = CreateStudentMutation.Field()
    updateStudent = UpdateStudentMutation.Field()

    createDivision = CreateDivisionMutation.Field()
    updateDivision = UpdateDivisionMutation.Field()

    createSeason = CreateSeasonMutation.Field()
    updateSeason = UpdateSeasonMutation.Field()

    createSchoolGrouping = CreateSchoolGroupingMutation.Field()
    updateSchoolGrouping = UpdateSchoolGroupingMutation.Field()

    createSchool = CreateSchoolMutation.Field()
    updateSchool = UpdateSchoolMutation.Field()

    # coach-level
    createTeam = CreateTeamMutation.Field()
    updateTeam = UpdateTeamMutation.Field()
    setTeamMembers = SetTeamMembersMutation.Field()
    updateContestAttendance = UpdateContestAttendanceMutation.Field()
    updateScore = UpdateScoreMutation.Field()
    deleteScore = DeleteScoreMutation.Field()

    createContest = CreateContestMutation.Field()

    addDivisionToSchool = AddDivisionToSchoolMutation.Field()


gql_schema = graphene.Schema(query=Query, mutation=Mutation)
