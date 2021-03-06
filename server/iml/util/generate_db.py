from iml.models.division import Division
from iml.models.team import Team
from iml.models.school import School
from iml import User


def generate_nyc_teams(app, db):
    teams = [("andrew's gotes", 1, 2), ("gilvir's gills", 1, 3)]
    with app.app_context():
        for team in teams:
            team_obj = Team.query.filter_by(name=team[0]).first()
            if not team_obj:
                team_obj = Team(name=team[0], school_id=team[1],division_id=team[2])
                db.session.add(team_obj)
                db.session.commit()

    return True

def generate_nyc_schools(app, db):
    schools = [("Stuy", "placeholder"), ("Hunter", "placeholder")]
    with app.app_context():
        for school in schools:
            school_obj = School.query.filter_by(name=school[0]).first()
            if not school_obj:
                school_obj = School(school[0])
                db.session.add(school_obj)
                db.session.commit()
    return True

def generate_nyc_users(app, db):
    users = [("ashy", "j'shanks", "j@gmail.com", "123-123-1234", "ashyjai", "jjj", False)]
    with app.app_context():
        for user in users:
            user_obj = User.query.filter_by(first=user[0]).first()
            if not user_obj:
                user_obj = User(user[0], user[1], user[2], user[3], user[4], user[5], user[6])
                if user[0] == "ashy":
                    user_obj.school_id = 1
                db.session.add(user_obj)
                db.session.commit()
    return True

def generate_nyc_divisions(app, db):
    divisions = [("Sophfrosh","sophfrosh"), ("Junior","junior"), ("Senior A","senior_a"), ("Senior B","senior_b")]
    with app.app_context():
        for div in divisions:
            div_obj = Division.query.filter_by(name=div[0]).first()
            if not div_obj:
                div_obj =  Division(div[0],div[1])
                db.session.add(div_obj)
                db.session.commit()
    return True
