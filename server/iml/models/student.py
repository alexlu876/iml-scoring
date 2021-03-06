from iml import db

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy

import datetime
from typing import Dict, List


class Student(db.Model):

    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(64), nullable=False)
    username = db.Column(db.String(64), nullable=False)
    nickname = db.Column(db.String(32), nullable=True)
    graduation_year = db.Column(db.Integer, nullable=False)
    creation_timestamp = db.Column(db.DateTime(), nullable=False)

    current_division_id = db.Column(
        db.Integer,
        db.ForeignKey('divisions.id'),
        nullable=True
    )

    current_team_id = db.Column(
        db.Integer,
        db.ForeignKey('teams.id'),
        nullable=True
    )

    school_id = db.Column(db.Integer, db.ForeignKey(
        'schools.id'),
        nullable=False)

    school = db.relationship('School', back_populates='students')
    scores = db.relationship('Score', back_populates='student')
    teams = association_proxy('division_associations', 'team')
    divisions = association_proxy('division_associations', 'division')

    # contests backreff'd
    current_division = db.relationship('Division',
                                       foreign_keys=[current_division_id],
                                       backref='current_students')
    current_team = db.relationship('Team',
                                   foreign_keys=[current_team_id],
                                   backref='current_students'
                                   )
    current_division_assoc = db.relationship(
        'StudentDivisionAssociation',
        primaryjoin="and_(Student.id==StudentDivisionAssociation.student_id,"
        "Student.current_division_id==StudentDivisionAssociation.division_id)",
        uselist=False
    )
    is_alternate = association_proxy('current_division_assoc', 'is_alternate')
    current_scores = db.relationship(
        'Score',
        viewonly=True,
        secondary="join(Question, Contest, Contest.id==Question.contest_id)."
        "join( Score, Question.id==Score.question_id )",
        primaryjoin="and_(Student.current_division_id==Contest.division_id"
        ",Student.id==Score.student_id)",
        secondaryjoin='Score.question_id==Question.id'
    )

    # if current_team is null, then they are an alternate
    # TODO - replaec team with current team
    # team = db.relationship('Team', back_populates='students')

    def __init__(self,
                 first, last,
                 graduation_year, school_id,
                 current_division_id=None, current_team_id=None,
                 nickname=None,):
        self.first = first
        self.last = last
        self.graduation_year = graduation_year
        self.nickname = nickname
        self.current_division_id = current_division_id
        self.current_team_id = current_team_id
        username_base = '{}_{}'.format(first[:16],
                                       last[:16]).replace(' ',
                                                          '_')
        username_num = Student.query.filter(
            Student.username.contains(username_base)).count()+1
        self.username = '{}{}'.format(username_base,
                                      username_num).lower()
        self.school_id = school_id
        self.creation_timestamp = datetime.datetime.utcnow()

    def isParticipant(self, contest, team=None) -> bool:
        import iml.models.score as score

        Score = score.Score
        scoresQuery = Score.query.filter_by(contest_id=contest.id,
                                            student_id=self.id)
        if team:
            scoresQuery = scoresQuery.filter_by(team_id=team.id)
        return scoresQuery.count() == contest.getQuestionCount()

    # participant is valid if they don't have scores for another team or are on the team
    # ie they are on the team or they're not on a team
    # AND them being a participant implies they participated for that team. Essetially serves as a
    # check that they have not already had scores entered for another team
    def isValidParticipant(self, contest, team) -> bool:
        return (self.team == team) or (self.team is None and
                                       (not(self.isParticipant(contest)) or
                                        self.isParticipant(contest, team)))

    # returns score in a dictionary
    def getScoresDict(self, contest,
                      division=None, team=None) -> Dict[int, int]:
        import iml.models.contest as contestModule
        import iml.models.score as score
        # the name contest was used!

        Score = score.Score
        if contest is None:
            return {}
        else:
            scoresQuery = Score.query.filter_by(contest_id=contest.id,
                                                student_id=self.id)
            if division:
                scoresQuery = scoresQuery.filter_by(division_id=division.id)
            if team:
                scoresQuery = scoresQuery.filter_by(team_id=team.id)
            scoresDict = {}
            for scoreObj in scoresQuery:
                scoresDict[scoreObj.getQuestionNum()] = scoreObj.getValue()
            return scoresDict

    def getAllScoresDict(self, division=None, team=None) -> List[Dict[int, int]]:
        import iml.models.contest as contestModule
        contestsQuery = contestModule.Contest.query.all()
        if division:
            contestsQuery = contestsQuery.filter_by(division_id=division.id)
        if team:
            contestsQuery = contestsQuery.filter_by(team_id=team.id)
        scores = []
        for contest in contestsQuery:
            contestScores = self.getScoresDict(contest)
            if contestScores == {}:
                scores.append(contestScores)
        return scores

    def getTeam(self, contest):
        import iml.models.contest as contestModule
        import iml.models.score as score
        Score = score.Score

        score_sample = Score.query.filter_by(
            contest_id=contest.id,
            student_id=self.id).first()
        if score_sample:
            return score_sample.team
        return None

    # returns actual final score
    def getFinalContestScore(self, contest):
        return sum(self.getScoresDict(contest).values())

    def getFinalScore(self):
        return sum(self.getAllScoresDict().values())

    def getUserId(self):
        return self.id

    def get_user_id(self):
        return self.getUserId()


class StudentDivisionAssociation(db.Model):
    __tablename__ = 'student_division_assoc'
    student_id = db.Column(
        db.Integer,
        db.ForeignKey('students.id'),
        nullable=False,
        primary_key=True
    )
    division_id = db.Column(
        db.Integer,
        db.ForeignKey('divisions.id'),
        nullable=False,
        primary_key=True
    )
    is_alternate = db.Column(db.Boolean,
                             nullable=False,
                             default=False)
    team_id = db.Column(
        db.Integer,
        db.ForeignKey('teams.id'),
        nullable=True)

    student = db.relationship('Student', backref='division_associations')
    division = db.relationship(
        'Division',
        backref='student_associations')
    team = db.relationship('Team',
                           backref='student_associations')

