from iml import db

school_division_table \
    = db.Table('school_division',
               db.Column('school_id',
                         db.Integer,
                         db.ForeignKey('schools.id')),
               db.Column('division_id',
                         db.Integer,
                         db.ForeignKey('divisions.id'))
               )


class Division(db.Model):

    __tablename__ = 'divisions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    url = db.Column(db.String(64), nullable=False)

    alternate_limit = db.Column(db.Integer, default=4)

    season_id = db.Column(db.Integer,
                          db.ForeignKey('seasons.id'),
                          nullable=False)
    successor_id = db.Column(db.Integer,
                             db.ForeignKey('divisions.id'),
                             nullable=True,
                             unique=True
                             )

    teams = db.relationship('Team', back_populates='division')
    # students backref'd
    contests = db.relationship('Contest', back_populates='division')
    schools = db.relationship('School',
                              secondary=school_division_table,
                              backref='divisions'
                              )

    season = db.relationship('Season',
                             back_populates='divisions')
    parents = db.relationship(
        'Division',
        backref=db.backref('successor', remote_side=[id]))

    def __init__(self, name, url, season_id,
                 alternate_limit=4, successor_id=None):
        self.name = name
        self.url = url
        self.season_id = season_id
        self.alternate_limit = alternate_limit
        self.successor_id = successor_id

    # only returns students who have scores
    def getParticipants(self):
        import iml.models.student as studentModule
        import iml.models.score as scoreModule
        import iml.models.contest as contestModule
        Student = studentModule.Student
        Score = scoreModule.Score
        Contest = contestModule.Contest

        div_id = self.id
        return Student.query.filter(
            Student.scores.any(
                Score.contest.has(
                    Contest.division_id == div_id)))
