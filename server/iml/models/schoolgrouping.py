from iml import db


class SchoolGrouping(db.Model):
    __tablename__ = 'school_groupings'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    url = db.Column(db.String(64), nullable=False)

    schools = db.relationship('School', back_populates='school_grouping')

    def __init__(self, name, url):
        self.name = name
        self.url = url
