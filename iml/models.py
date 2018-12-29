from iml.database import db


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer,
            primary_key=True)
    first = db.Column(db.String(32), nullable=False)
    last = db.Column(db.String(32), nullable=False)
