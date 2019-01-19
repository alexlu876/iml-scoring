from iml.database import db
import bcrypt


# relationships




class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer,
                   primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    phone_num = db.Column(db.String(32), nullable=False)
    username = db.Column(db.String(32), nullable=False)
    password = db.Column(db.Binary(60), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False)
    approval_status = db.Column(db.Integer)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'))

    school = db.relationship('School', back_populates='coaches')
    scores = db.relationship('Score', back_populates='coach')

    def __init__(self, first, last, email, phone_num,
                 username, password, is_admin):
        self.first = first
        self.last = last
        self.email = email
        self.phone_num = phone_num
        self.is_admin = is_admin
        self.username = username
        self.setPassword(password)

    def setPassword(self, newpass):
        self.password = bcrypt.hashpw(newpass.encode("utf-8"),
                                      bcrypt.gensalt(12))

    def checkPassword(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password)


class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(32), nullable=False)
    username = db.Column(db.String(32), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'),nullable=False)
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
    # ie they are on the team or they're not on a team AND them being a participant implies they participated for that team. Essetially serves as a
    # check that they have not already had scores entered for another team
    def isValidParticipant(self, contest, team):
        return (self.team == team) or (self.team is None and
                                       (not(self.isParticipant(contest)) or
                                        self.isParticipant(contest, team)))

    # returns score in a dictionary
    def getScores(self, contest, division=None, team=None):
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

    def getAllScores(self, division=None,team = None):
        contestsQuery = Contest.query.all()
        if division:
            contestsQuery = contestsQuery.filter_by(division_id=division.id)
        if team:
            contestsQuery = contestsQuery.filter_by(team_id=team.id)
        scores = []
        for contest in contestsQuery:
            contestScores = self.getScores(contest)
            if contestScores == {}:
                scores.append(contestScores)
        return scores
    # returns actual final score
    def getFinalContestScore(self, contest):
        return sum(self.getScores(contest).values())
    def getFinalScore(self):
        return sum(self.getAllScores().values())


class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    # ASSERT: {0,1}
    question_num = db.Column(db.Integer, nullable=False)
    question_value = db.Column(db.Integer, default=1,nullable=False)
    points_awarded = db.Column(db.Integer, nullable=False)

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

    # returns max points. currently stored locally, might change to be stored in a seperate table.
    def getMaxPoints(self):
        return self.question_value
    def getValue(self):
        return self.points_awarded
    def setValue(self, value):
        self.points_awarded = value
    def getQuestionNum(self):
        return self.question_num


class Contest(db.Model):
    __tablename__ = 'contests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    start_time = db.Column(db.DateTime(), nullable=False)
    question_count = db.Column(db.Integer, nullable=False)
    team_size = db.Column(db.Integer, nullable=False,
                          default=5)
    division_id = db.Column(db.Integer, db.ForeignKey('divisions.id'), nullable=False)

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
        pass


class School(db.Model):
    __tablename__ = 'schools'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)

    # teams, schools, students, coaches
    teams = db.relationship('Team', back_populates='school')
    coaches = db.relationship('User', back_populates='school')
    students = db.relationship('Student', back_populates='school')

    def __init__(self, name):
        self.name = name

    # TODO - sqlify this method
    def getDivisionsList(self):
        schools_divisions = []
        for team in self.teams:
            division = team.division
            if division not in schools_divisions:
                schools_divisions.append(division)
        return schools_divisions


class Team(db.Model):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    division_id = db.Column(db.Integer, db.ForeignKey('divisions.id'),
                            nullable=False)

    school = db.relationship('School', back_populates = 'teams')
    division = db.relationship('Division', back_populates = 'teams')

    scores = db.relationship('Score', back_populates = 'team')
    students = db.relationship('Student', back_populates = 'team')
    def __init__(self, name, school_id, division_id):
        self.name = name
        self.school_id = school_id
        self.division_id = division_id


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
