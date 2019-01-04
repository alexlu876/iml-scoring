from iml.database import db
import bcrypt


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
    school_id = db.Column(db.Boolean, db.ForeignKey('schools.id'))

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
        db.session.add(self)
        db.session.commit()

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

    school = db.relationship('School', back_populates='students')
    scores = db.relationship('Score', back_populates='student')


    # returns a list of ({0,1}) integers with information on whether they got the questions right
    def getScores(self, contest=None):
        if contest is None:
            scores_query = Score.query.filter_by(is_correct=1)
        else:
            scores_query = Score.query.filter_by(is_correct=1,contest=contest)
        # TODO -  turn this into the list, because its an unordered query list
        # sort by -- date of contest, question number

    # returns actual final score
    def getFinalContestScore(self, contest):
        return sum(self.getScores(contest))
    def getFinalScore(self):
        return sum(self.getScores())


class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    # ASSERT: {0,1}
    question_num = db.Column(db.Integer, nullable=False)
    is_correct = db.Column(db.Integer, nullable=False)
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


class Contest(db.Model):
    __tablename__ = 'contests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    question_count = db.Column(db.Integer, nullable=False)
    division_id = db.Column(db.Integer, db.ForeignKey('divisions.id'), nullable=False)

    division = db.relationship('Division', back_populates='contests')

    scores = db.relationship('Score', back_populates='contest')

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




class Division(db.Model):
    __tablename__ = 'divisions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)

    teams = db.relationship('Team', back_populates = 'division')
    contests = db.relationship('Contest', back_populates = 'division')
