# relationships
from iml.models.contest import Contest, ContestAttendance
from iml.models.question import Question
from iml.models.category import question_category_table, Category
from iml.models.score import Score
from iml.models.student import (
    Student,
    StudentDivisionAssociation
)
from iml.models.division import school_division_table, Division
from iml.models.schoolgrouping import SchoolGrouping
from iml.models.school import School, RegistrationCode
from iml.models.user import User
from iml.models.team import Team
from iml.models.season import Season
