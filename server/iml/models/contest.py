from iml import db
from sqlalchemy.ext.associationproxy import association_proxy


class ContestAttendance(db.Model):
    __tablename__ = 'contest_attendance'

    contest_id = db.Column(db.Integer,
                           db.ForeignKey('contests.id'),
                           primary_key=True)
    student_id = db.Column(db.Integer,
                           db.ForeignKey('students.id'),
                           primary_key=True)
    team_id = db.Column(db.Integer,
                        db.ForeignKey('teams.id'),
                        nullable=True)
    attended = db.Column(db.Boolean,
                         nullable=False)
    contest = db.relationship('Contest',
                              backref='attendance')
    student = db.relationship('Student',
                              backref='attendance')
    team = db.relationship('Team',
                           backref='contest_attendances')

    def __init__(self, contest_id, student_id, attended, team_id=None):
        self.contest_id = contest_id
        self.student_id = student_id
        self.team_id = team_id
        self.attended = attended


class Contest(db.Model):

    __tablename__ = 'contests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    start_time = db.Column(db.DateTime(), nullable=False)
    question_count = db.Column(db.Integer,
                               nullable=False,
                               default=6)
    team_size = db.Column(db.Integer, nullable=False,
                          default=5)
    # determines whether competition is active.
    # Negative means disabled, other status codes to be added later
    status = db.Column(db.Integer, nullable=False,
                       default=1)
    division_id = db.Column(db.Integer,
                            db.ForeignKey('divisions.id'),
                            nullable=False)
    division = db.relationship('Division', back_populates='contests')
    questions = db.relationship('Question', back_populates='contest')

    # attendance backreffed
    attending_students = association_proxy(
        'attendance',
        'student',
    )

    def __init__(self, name, start_time, question_count=6, team_size=5):
        self.name = name
        self.start_time = start_time
        self.question_count = question_count
        self.team_size = team_size

    # scores backref'd

    def getQuestionCount(self):
        return self.question_count

    def getTeamSize(self):
        return self.team_size

    def getScores(self):
        return self.scores

    # returns a list of students who have scores for a contest
    def getAttendees(self):
        return self.attending_students

    def isActive(self):
        return self.status < 0

    def getDate(self):
        return self.start_time.date()

    def getQuestion(self, number):
        import iml.models.question as questionModule
        Question = questionModule.Question
        return Question.query. \
            filter_by(contest_id=self.id,
                      question_num=number). \
            first()

    def getHighestPossibleScore(self):
        total = 0
        for i in range(1, self.question_count+1):
            total += self.getQuestion(i).getMaxScore()
        return total
