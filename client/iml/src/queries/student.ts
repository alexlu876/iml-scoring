import gql from 'graphql-tag'


export const SCHOOLS_QUERY = gql`
query {
    schools {
        edges {
            node {
                name
                url
                id
                schoolGroupingId
            }
        }
    }
}
`

export const SCHOOL_GROUPINGS_QUERY = gql`
query {
    schoolGroupings {
        edges {
            node {
                name
                id
                url
            }
        }
    }
}
`
export const STUDENTS_QUERY = gql`query{students{
    edges {
        node {
            id
            first
            last
            graduationYear
            schoolId
            currentDivisionId
            currentTeamId
            nickname
            currentDivisionAssoc {
                isAlternate
            }
        }}}}`

export const VIEWERS_STUDENTS = gql`
query {
    viewerStudents {
        edges { 
            node {
                id
                first
                last
                graduationYear
                schoolId
                currentDivisionId
                nickname
                currentDivisionAssoc {
                    isAlternate
                }
            }
        }
    }
}
`

export const STUDENT_CONTEST_ATTENDANCE = gql`
query StudentContestAttendance($contestId: ID!, $studentId: ID!) {
    studentIsAlternate(contestId: $contestId, studentId: $studentId)
    studentContestAttendance(contestId: $contestId, studentId: $studentId) {
        id
        attended
        contest {
            divisionId
            id
        }
        studentId
        contestId
        teamId
        team {
            name
            id
        }
    }
    student (id: $studentId) {
        currentTeamId
        currentTeam {
            name
            id
        }
        id
        first
        last
    }
}
`

export const VIEWER_STUDENTS_BY_CONTEST = gql`
query ViewerStudentsByContest($contestId: ID!) {
    viewerStudentsByContest(contestId: $contestId) {
        edges {
            node {
                currentDivisionId
                id
                currentTeamId
                schoolId
                username
                nickname
                first
                last
            }
        }
    }
}
`
export const VIEWER_ATTENDEES_BY_CONTEST = gql`
query ViewerAttendeesByContest($contestId: ID!) {
    viewerAttendeesByContest(contestId: $contestId) {
        edges {
            node {
                id
                first
                last
                username
                nickname
                currentTeamId
                currentTeam {
                    id
                    name
                }
            }
        }
    }
}
`
export const CREATE_SCHOOL = gql`
    mutation CreateSchool(
    $name: String!,
    $schoolGroupingId: ID!,
    $url: String!) {
        createSchool(name: $name,
            schoolGroupingId:
            $schoolGroupingId,url: $url) {
            school {
                id
            }
        }
    }
`
export const CREATE_SCHOOL_GROUPING = gql`
mutation CreateSchoolGrouping($name: String!, $url: String!) {
    createSchoolGrouping(name: $name, url: $url) {
        schoolGrouping {
            id
            url
            name
        }
    }
}
`
export const UPDATE_SCHOOL_GROUPING = gql`
mutation UpdateSchoolGrouping($id: ID!, $name: String, $url: String) {
    updateSchoolGrouping(id: $id name: $name, url: $url) {
        schoolGrouping {
            id
            url
            name
        }
    }
}
`
export const CREATE_STUDENT = gql`
    mutation CreateStudent($first: String!, $last:String!, 
        $graduationYear:Int!, $schoolId:ID, $currentDivisionId:ID!, 
        $nickname: String, $isAlternate: Boolean){
        createStudent(studentInfo:{
            first:$first,
            last:$last,
            graduationYear:$graduationYear
            schoolId:$schoolId,
            currentDivisionId:$currentDivisionId,
            nickname: $nickname,
            isAlternate: $isAlternate
        }) {student {id}
        }
    }`

export const UPDATE_SCHOOL = gql`
    mutation UpdateSchool(
    $id: ID!,
    $name: String,
    $schoolGroupingId: ID,
    $url: String) {
        updateSchool(
            id: $id
            name: $name,
            schoolGroupingId:
            $schoolGroupingId,
            url: $url) {
            school {
                id
            }
        }
    }
`

export var DELETE_STUDENT = gql`
    mutation deleteStudent ($id: ID!){
      deleteStudent (id: $id) {id}} `

export var UPDATE_STUDENT = gql`
    mutation UpdateStudent($id:ID!, $first: String!, $last:String!,
        $graduationYear:Int!, $schoolId:ID!, $currentDivisionId:ID!,
        $nickname:String, $isAlternate: Boolean){
        updateStudent(id:$id, studentInfo:{
            first:$first,
            last:$last,
            graduationYear:$graduationYear,
            schoolId: $schoolId,
            nickname:$nickname,
            currentDivisionId:$currentDivisionId,
            isAlternate: $isAlternate 
        }) {
            id
            student {
                first
                nickname
                id
                last
            }
        }
    }
`

export const UPDATE_CONTEST_ATTENDANCE = gql`
mutation UpdateContestAttendance($attended: Boolean!, $contestId: ID!, $studentId: ID!, $teamId: ID)  {
    updateContestAttendance(attended: $attended, contestId: $contestId, studentId: $studentId, teamId: $teamId) {
        attendance {
            studentId
            contestId
            attended
            teamId
        }
    }
}
`
