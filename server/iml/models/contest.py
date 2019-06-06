from iml import db
import iml.models.student as student
import iml.models.question as question
import iml.models.score as score


Student = student.Student
Question = question.Question
Score = score.Score


class Contest(db.Model):

    __tablename__ = 'contests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    start_time = db.Column(db.DateTime(), nullable=False)
    question_count = db.Column(db.Integer, nullable=False)
    team_size = db.Column(db.Integer, nullable=False,
                          default=5)
    # determines whether competition is active.
    # Negative means disabled, other status codes to be added later
    status = db.Column(db.Integer, nullable=False,
                       default=1)
    division_id = db.Column(db.Integer,
                            db.ForeignKey('divisions.id'),
                            nullable=False)

    def __init__(self, name, start_time, question_count):
        self.name = name
        self.start_time = start_time
        self.question_count = question_count

    division = db.relationship('Division', back_populates='contests')

    scores = db.relationship('Score', back_populates='contest')

    def getQuestionCount(self):
        return self.question_count

    def getTeamSize(self):
        return self.team_size

    def getScores(self):
        return self.scores

    # returns a list of students who have scores for a contest
    def getAttendees(self):
        contest_id = self.id
        return Student.query.filter(Student.scores.any(Score.contest_id == contest_id))

    def isActive(self):
        return self.status < 0

    def getDate(self):
        return self.start_time.date()

    def getQuestion(self, number):
        return Question.query. \
            filter_by(contest_id=self.id,
                      question_num=number). \
            first()

    def getHighestPossibleScore(self):
        total = 0
        for i in range(1,self.question_count+1):
            total+=self.getQuestion(i).getMaxScore()
        return total
