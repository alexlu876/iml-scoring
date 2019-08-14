from iml import db

class Season(db.Model):

    __tablename__ = 'seasons'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64),
                     unique=True,
                     nullable=False)
    url = db.Column(db.String(32),
                    unique=True,
                    nullable=False)
    start_date = db.Column(db.Date(),
                           nullable=False)
    end_date = db.Column(db.Date(),
                         nullable=False)

    divisions = db.relationship('Division',
                                back_populates='season')


    def __init__(self, name, url, start_date, end_date):
        self.name = name
        self.url = url
        self.start_date = start_date
        self.end_date = end_date

    # TODO : write this
    @classmethod
    def current(cls):
        pass




