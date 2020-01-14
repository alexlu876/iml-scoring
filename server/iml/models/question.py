from iml import db


class Question(db.Model):
    __tablename__ = 'questions'
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['contest_id'],
            ['contests.id']),
        db.UniqueConstraint('contest_id', 'question_num'),
    )
    id = db.Column(db.Integer,
                   primary_key=True)
    contest_id = db.Column(db.Integer,
                           nullable=False)
    question_num = db.Column(db.Integer,
                             autoincrement=False,
                             nullable=False)
    question_string = db.Column(db.UnicodeText(),
                                nullable=True)
    question_value = db.Column(db.Integer,
                               nullable=False,
                               default=1)

    # categories relation back-reffed
    scores = db.relationship('Score',
                             back_populates='question')
    contest = db.relationship('Contest',
                              back_populates='questions')

    def __init__(self, contest_id, question_num,
                 question_string=None,
                 question_value=1):
        self.contest_id = contest_id
        self.question_num = question_num
        self.question_string = question_string
        self.question_value = question_value

    def getMaxScore(self):
        return self.question_value
