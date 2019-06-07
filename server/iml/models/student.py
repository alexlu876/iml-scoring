from iml import db

import iml.models.score as score
# the name contest was used!
import iml.models.contest as contestModule

Score = score.Score

class Student(db.Model):

    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(32), nullable=False)
    username = db.Column(db.String(32), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey(
        'schools.id'),
        nullable=False)
    # divis
    division_id = db.Column(db.Integer, db.ForeignKey('divisions.id'),
                            nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'),
                        nullable=True)

    school = db.relationship('School', back_populates='students')
    scores = db.relationship('Score', back_populates='student')
    division = db.relationship('Division', back_populates='students')
    # if team is null, then they are an alternate
    team = db.relationship('Team', back_populates='students')

    # returns whether the person participated in this contest for the specified team
    def isParticipant(self,contest,team=None):
        scoresQuery = Score.query.filter_by(contest_id=contest.id,
                                            student_id=self.id)
        if team:
            scoresQuery = scoresQuery.filter_by(team_id=team.id)
        return scoresQuery.count() == contest.getQuestionCount()

    # participant is valid if they don't have scores for another team or are on the team
    # ie they are on the team or they're not on a team
    # AND them being a participant implies they participated for that team. Essetially serves as a
    # check that they have not already had scores entered for another team
    def isValidParticipant(self, contest, team):
        return (self.team == team) or (self.team is None and
                                       (not(self.isParticipant(contest)) or
                                        self.isParticipant(contest, team)))

    # returns score in a dictionary
    def getScoresDict(self, contest, division=None, team=None):
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

    def getAllScoresDict(self, division=None, team = None):
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
        score_sample = Score.query.filter_by(contest_id=contest.id, student_id=self.id).first()
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