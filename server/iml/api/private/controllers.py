from flask import Blueprint, session, request
from flask import jsonify, make_response
from datetime import datetime

from iml.util import get_user

from iml.database import db
from iml.models.team import Team
from iml.models import Student, Score, Contest

from iml.core.user.wrappers import login_required

private_api = Blueprint("private_api", __name__)

def json_response(data, status=200):
    response = make_response(jsonify(data), status)
    return response


@private_api.route("/scores/add", methods=['POST'])
@login_required()
def add_score():
    response_data = {}
    req_json = request.get_json()
    if not req_json:
        response_data["message"] = "Invalid data format!"
        return json_response(response_data, 400)
    user = get_user(session["userdata"]["id"])
    contest_id = req_json.get("contest_id")
    team_id = req_json.get("team_id")
    student_display_name = req_json.get("student_display_name")
    scores_json = req_json.get("scores")
    scores = {}
    # transform it into integer-keys
    if scores_json:
        for score in scores_json:
            try:
                scores[int(score)] = scores_json[score]
            except ValueError:
                response_data["message"] = "Invalid data format"
                return json_response(response_data,400)
    # scores - dict of scores ie {1:0, 2:1}

    contest = Contest.query.filter_by(id=contest_id).first()
    team = Team.query.filter_by(id=team_id).first()
    student = Student.query.filter_by(username=student_display_name).first()

    if not (contest_id and team_id and student_display_name and user):
        response_data["message"] = "Not enough data provided!"
        return json_response(response_data, 400)
    if not (contest and team and student):
        response_data["message"] = "Invalid contest team or student"
        return json_response(response_data, 400)
    userIsCoach = user.school and user.school == team.school
    isPossibleMember = (not student.team and student.school == team.school) or student.team == team
    if not (userIsCoach and isPossibleMember):
        response_data["message"] = "You cannot manage this group!"
        return json_response(response_data, 403)

    # make sure the key values are [1->n+1)
    expected_keys = [i for i in range(1,contest.getQuestionCount()+1)]
    if scores and sorted(list(scores.keys())) == expected_keys:
        teamScoresQuery = Score.query.filter_by(contest_id=contest_id,
                                                team_id=team_id)
        studentScoresQuery = Score.query.filter_by(contest_id=contest_id,
                                                   student_id=student.id)
        if studentScoresQuery.count() != 0:
            # if the scores need be updated
            for oldScoreObject in studentScoresQuery:
                question_num = oldScoreObject.getQuestionNum()
                question_points = min(oldScoreObject.getMaxPoints(),
                                      scores[question_num])
                oldScoreObject.points_awarded = question_points
                db.session.commit()
            response_data["message"] = "Student already had scores and they were instead updated"
            return json_response(response_data,200)
        # if the full data set is already submitted:
        if teamScoresQuery.count() >= contest.getQuestionCount() * contest.getTeamSize():
            response_data["message"] = "There appears to already be a full dataset submitted!"
            return json_response(response_data, 400)
        else:
            for question_num in scores:

                newScoreObject = Score(question_num=question_num,
                                       points_awarded=scores[question_num],
                                       timestamp=datetime.utcnow(),
                                       contest_id=contest_id,
                                       team_id=team_id,
                                       coach_id=user.id,
                                       student_id=student.id)
                db.session.add(newScoreObject)
                db.session.commit()
    else:
        # formatting incorrect for keys:
        response_data["message"] = "Keys don't match expected format!"
        return json_response(response_data,400)

    response_data["status"] = 1
    return json_response(response_data, 200)

@private_api.route("/students/query/contest")
@login_required()
def list_students():
    contest_id = request.args.get('contest_id')
    team_id = request.args.get('team_id')

    user = get_user(session["userdata"]["id"])
    school = user.school
    contest = Contest.query.filter_by(id=contest_id).first()
    team = Team.query.filter_by(id=team_id).first()
    if not (contest and user and team) or (team.school != school) or (contest.division != team.division):
        return json_response(0, 400)

    studentsQuery = Student.query.filter_by(school_id=school.id,division_id=contest.division.id)
    student_usernames = [student.username for student in studentsQuery
                if student.isValidParticipant(contest=contest, team=team)]
    return json_response(student_usernames, 200)


@private_api.route("/scores/query/contest", methods=['GET'])
def view_score():
    contest_id = request.args.get('contest_id')
    students_requested = request.args.get('student_display_names')
    if students_requested:
        students_requested = students_requested.split(',')
    else:
        return json_response({}, 400)
    scoreDict = {}
    for student_display_name in students_requested:
        #team_id = request.args.get('team_id')

        contest = Contest.query.filter_by(id=contest_id).first()
        student = Student.query.filter_by(username=student_display_name).first()

        if contest and student:
            scoreDict[student_display_name] = student.getScoresDict(contest)
        else:
            return json_response(scoreDict, 400)
    return json_response(scoreDict, 200)


@private_api.route("/scores/delete/student/<student_username>/contest/<contest_id>",
                   methods=['DELETE'])
@login_required()
def delete_score(student_username, contest_id):
    user = get_user(session["userdata"]["id"])
    student = Student.query.filter_by(username=student_username).first()
    contest = Contest.query.get(contest_id)

    if not contest or (user.school != student.school):
        return json_response({}, 400)
    scores = Score.query.filter_by(student_id=student.id,
                                   contest_id=contest.id)
    scores.delete()
    db.session.commit()
    return json_response({}, 200)
