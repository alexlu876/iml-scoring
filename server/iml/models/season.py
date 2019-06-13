from iml import db

class Season(db.Model):

    __tablename__ = 'seasons'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(16), unique=True)

    def __init__(self, name):
        self.name = name



