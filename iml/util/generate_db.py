from iml.models import Division


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
