from iml import db


class School(db.Model):
    __tablename__ = 'schools'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    # school_grouping_id = db.Column(db.Integer,
     # db.ForeignKey('school_groupings.id')
     # , nullable=False)

    # teams, schools, students, coaches
    teams = db.relationship('Team', back_populates='school')
    coaches = db.relationship('User', back_populates='school')
    students = db.relationship('Student', back_populates='school')

    # school_grouping = db.relationship('SchoolGrouping', back_populates='schools')


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
