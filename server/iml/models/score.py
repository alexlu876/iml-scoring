from iml import db

import iml.models.question as questionModule

class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    question_num = db.Column(db.Integer, nullable=False)
    points_awarded = db.Column(db.Integer,
                               nullable=False)
    contest_id = db.Column(db.Integer,db.ForeignKey('contests.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    timestamp = db.Column(db.DateTime(), nullable=False)

    # relationships
    contest = db.relationship('Contest', back_populates = 'scores')
    student = db.relationship('Student', back_populates = 'scores')
    coach = db.relationship('User', back_populates = 'scores')
    team = db.relationship('Team', back_populates = 'scores')



    def getValue(self):
        return self.points_awarded

    def setValue(self, value):
        self.points_awarded = value

    def getQuestionNum(self):
        return self.question_num

    def getQuestion(self):
        Question = questionModule.Question
        return Question.query.filter_by(contest_id=self.contest.id,
                                        question_num=self.question_num).first()
    def getMaxPoints(self):
        return self.getQuestion().getMaxScore()
