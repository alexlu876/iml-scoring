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
    mutation CreateStudent($first: String!, $last:String!, $graduationYear:Int!, $schoolId:ID!, $currentDivisionId:ID!, $nickname: String,){
        createStudent(studentInfo:{
            first:$first,
            last:$last,
            graduationYear:$graduationYear
            schoolId:$schoolId,
            currentDivisionId:$currentDivisionId,
            nickname: $nickname
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
    mutation UpdateStudent($id:ID!, $first: String!, $last:String!, $graduationYear:Int!, $schoolId:ID!, $currentDivisionId:ID!, $nickname:String){
        updateStudent(id:$id, studentInfo:{
            first:$first,
            last:$last,
            graduationYear:$graduationYear,
            schoolId: $schoolId,
            nickname:$nickname,
            currentDivisionId:$currentDivisionId,
        }) {
            id
            student {
                first
                last
            }
        }
    }`
