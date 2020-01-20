from iml import db


class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    points_awarded = db.Column(db.Integer,
                               nullable=False)
    student_id = db.Column(db.Integer,
                           db.ForeignKey('students.id'),
                           nullable=False)
    question_id = db.Column(db.Integer,
                            db.ForeignKey('questions.id'),
                            nullable=False)
    coach_id = db.Column(db.Integer,
                         db.ForeignKey('users.id'),
                         nullable=False)
    team_id = db.Column(db.Integer,
                        db.ForeignKey('teams.id'),
                        nullable=True)
    timestamp = db.Column(db.DateTime(),
                          nullable=False)

    # relationships
    student = db.relationship('Student', back_populates='scores')
    coach = db.relationship('User', back_populates='scores')
    team = db.relationship('Team', back_populates='scores')
    question = db.relationship('Question', back_populates='scores')

    contest = db.relationship(
        'Contest',
        secondary='questions',
        secondaryjoin='Contest.id==Question.contest_id',
        primaryjoin='Question.id==Score.question_id',
        backref='scores',
        uselist=False
        )

    def getValue(self):
        return self.points_awarded

    def setValue(self, value):
        self.points_awarded = value

    def getQuestionNum(self):
        return self.question_num

    def getQuestion(self):
        return self.question

    def getMaxPoints(self):
        return self.getQuestion().getMaxScore()
