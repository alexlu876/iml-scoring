import bcrypt
import secrets
import datetime

from iml import db


class PasswordReset(db.Model):
    __tablename__ = 'password_resets'
    __table_args__ = (
        db.UniqueConstraint('code',),
    )
    id = db.Column(db.Integer,
                   primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    code = db.Column(db.String(16), nullable=False)
    expiration_time = db.Column(db.DateTime(), nullable=False)
    used = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, user_id, code=None, expiration_time=None):
        self.user_id = user_id
        if code:
            self.code = code
        else:
            self.code = hex(0x100000 +
                            secrets.randbelow(0xffffff-0x100000))[2:]
        if expiration_time:
            self.expiration_time = expiration_time
        else:
            self.expiration_time = datetime.datetime.utcnow() \
                + datetime.timedelta(minutes=30)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer,
                   primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    phone_num = db.Column(db.String(32), nullable=True)
    username = db.Column(db.String(32), nullable=False)
    password = db.Column(db.Binary(60), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    approval_status = db.Column(db.Integer, nullable=False, default=0)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'))

    school = db.relationship('School', back_populates='coaches')
    scores = db.relationship('Score', back_populates='coach')
    # code and issued_codes backref'd

    students = db.relationship(
        'Student',
        secondary='schools',
        secondaryjoin='School.id==Student.school_id',
        primaryjoin='School.id==User.school_id',
        backref='coaches'
    )

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

    def isAdmin(self):
        return self.is_admin

    def isApproved(self):
        return self.isAdmin() or self.approval_status > 0

    def isSchoolAdmin(self, school):
        return self.isAdmin() or (
            self.isApproved() and self.school_id == school.id
        )
