from iml import db

import iml.models.student as studentModule
import iml.models.score as scoreModule
import iml.models.contest as contestModule

class Division(db.Model):

    __tablename__ = 'divisions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    url = db.Column(db.String(64), nullable=False)

    teams = db.relationship('Team', back_populates = 'division')
    students = db.relationship('Student', back_populates='division')
    contests = db.relationship('Contest', back_populates = 'division')

    def __init__(self, name, url):
        self.name = name
        self.url = url

    # only returns students who have scores
    def getParticipants(self):
        Student = studentModule.Student
        Score = scoreModule.Score
        Contest = contestModule.Contest

        div_id = self.id
        return Student.query.filter(Student.scores.any(Score.contest.has(Contest.division_id == div_id)))
