from iml import db


class Question(db.Model):
    __tablename__ = 'questions'
    contest_id = db.Column(db.Integer,
                           db.ForeignKey('contests.id'),
                           primary_key=True)
    question_num = db.Column(db.Integer,
                             autoincrement=False,
                             primary_key=True)
    question_string = db.Column(db.String(128),
                                nullable=True)
    question_value = db.Column(db.Integer,
                               nullable=False,
                               default=1)

    #scores relationship backref'd

    def __init__(self, contest_id, question_num,
                 question_string=None,
                 question_value=1):
        self.contest_id = contest_id
        self.question_num = question_num
        self.question_string = question_string
        self.question_value = question_value

    def getMaxScore(self):
        return self.question_value
