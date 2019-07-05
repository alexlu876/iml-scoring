import bcrypt

from iml import db


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

    def isAdmin(self):
        return self.is_admin

    def isApproved(self):
        return self.isAdmin() or self.approval_status > 0
