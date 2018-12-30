from iml.database import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer,
            primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    phone = db.Column(db.String(32), nullable=False)
    #school = ??
    username = db.Column(db.String(32), nullable=False)
    password = db.Column(db.Binary(60), nullable=False)
    admin = db.Column(db.Boolean, nullable=False)

    def setPassword(self, newpass):
        self.password = bcrypt.hashpw(newpass.encode("utf-8"), bcrypt.gensalt(12))

    def checkPassword(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password)
    
        

    

class Student(db.Model):
    __tablename __ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(32), nullable=False)
    division = db.Column(db.String(32), nullable=False)
    pubid = db.Column(db.String(32), nullable=False)
  



class Score(db.Model):
    __tablename__  = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    contest_id = db.Column(db.Integer, nullable=False)
    student_id = db.Column(db.Integer, nullable=False)
    coach_id  = db.Column(db.Integer, nullable=False)
    team_id = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime(), nullable=False)




class Contest(db.Model):
    __tablename__ = 'contests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    question_count = db.Column(db.Integer, nullable=False)


