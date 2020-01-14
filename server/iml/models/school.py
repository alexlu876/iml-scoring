from iml import db
import secrets
import binascii


class School(db.Model):
    __tablename__ = 'schools'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    url = db.Column(db.String(64), nullable=False)
    school_grouping_id = db.Column(
        db.Integer,
        db.ForeignKey('school_groupings.id'),
        nullable=False
    )

    # teams, schools, students, coaches
    teams = db.relationship('Team', back_populates='school')
    coaches = db.relationship('User', back_populates='school')
    students = db.relationship('Student', back_populates='school')
    # divisions backref'd
    codes = db.relationship('RegistrationCode', back_populates='school')

    school_grouping = db.relationship(
        'SchoolGrouping',
        back_populates='schools')

    def __init__(self, name, url, groupId):
        self.name = name
        self.url = url
        self.school_grouping_id = groupId

    # TODO - sqlify this method
    def getDivisionsList(self):
        schools_divisions = []
        for team in self.teams:
            division = team.division
            if division not in schools_divisions:
                schools_divisions.append(division)
        return schools_divisions


class RegistrationCode(db.Model):
    __tablename__ = 'register_codes'
    school_id = db.Column(
        db.Integer,
        db.ForeignKey('schools.id'),
        nullable=False,
    )
    code = db.Column(
        db.String(16),
        nullable=False,
        unique=True,
        primary_key=True
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=True)
    issuer_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False)

    school = db.relationship('School', back_populates='codes')
    used_by = db.relationship('User',
                              foreign_keys=[user_id],
                              backref='code',
                              uselist=False
                              )
    issuer = db.relationship('User',
                             foreign_keys=[issuer_id],
                             backref='issued_codes')

    def __init__(self, school_id, issuer_id, code=None):
        # TODO - edge case check for redundant codes
        if not code:
            self.code = hex(0x100000 +
                            secrets.randbelow(0xffffff-0x100000))[2:]
        else:
            self.code = code
        self.school_id = school_id
        self.issuer_id = issuer_id
