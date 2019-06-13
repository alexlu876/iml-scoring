from iml import db

class Schoolgrouping(db.Model):

    __tablename__ = 'schoolgroupings'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))

    def __init__(self, name):
        self.name = name


