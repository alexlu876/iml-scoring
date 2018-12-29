from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Student():

    def __init__(self, division, first, last):
        self.first = first
        self.last = last
        self.division = division



class User():

    def __init__(self, email, phone, first, last, school, admin=False):
        self.admin = admin
        self.email = email
        self.phone = phone
        self.first = first
        self.last = last
        self.school = school



class Scores():
    
    def __init__(self, contestid, studnetid, coachid, teamid):
        self.contestid = contestid
        self.studentid = studentid
        self.coachid = coachid
        self.teamid = teamid


class Contest():

    def __init__(self, name, date, numquestions=6):
        self.name = name
        self.date = date
        self.numquestions = numquestions
