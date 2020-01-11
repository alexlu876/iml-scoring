import gql from 'graphql-tag'
export const USERS_QUERY = gql`
    {
        users {
            edges {
                node {
                    id}
            }
        }
    }`


export const SCHOOLS_QUERY = gql`
query {
    schools {
        edges {
            node {
                name
                id
                schoolGroupingId
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
            divisionId
            teamId
            nickname
        }}}}`
export var CREATE_STUDENT = gql`
    mutation CreateStudent($first: String!, $last:String!, $graduationYear:Int!, $schoolId:ID!, $divisionId:ID!){
        createStudent(studentInfo:{
            first:$first,
            last:$last,
            graduationYear:$graduationYear
            schoolId:$schoolId,
            divisionId:$divisionId,}) {student {id}
        }
    }`

export var DELETE_STUDENT = gql`
    mutation deleteStudent ($id: ID!){
      deleteStudent (id: $id) {id}} `

export var UPDATE_STUDENT = gql`
    mutation UpdateStudent($id:ID!, $first: String!, $last:String!, $graduationYear:Int!, $schoolId:ID!, $divisionId:ID!, $teamId:ID, $nickname:String){
        updateStudent(id:$id, studentInfo:{
            first:$first,
            last:$last,
            graduationYear:$graduationYear,
            nickname:$nickname,
            teamId:$teamId
        }) {
            id
            student {
                first
                last
            }
        }
    }`
