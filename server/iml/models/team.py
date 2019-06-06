from iml import db


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