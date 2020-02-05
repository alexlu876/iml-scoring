import gql from 'graphql-tag';


export const SCHOOL_GROUPINGS_QUERY = gql`
query {
    schoolGroupings {
        edges {
            node {
                id
                name
            }
        }
    }
}

`

export const NO_TEAM_STUDENTS_QUERY = gql`
query NoTeamStudents($divisionId: ID!, $schoolId: ID!) {
    noTeamStudents(divisionId: $divisionId schoolId:$schoolId ) {
        edges {
            node {
                username
                nickname
                id
                first
                last
            }
        }
    }
}
`

export const TEAM_CURRENT_STUDENTS_QUERY = gql`
query TeamCurrentStudents ($teamId: ID!) {
    teamCurrentStudents(teamId: $teamId) {
        edges {
            node {
                username
                first
                last
                nickname
                id
            }
        }
    }
}
`

export const VIEWER_SCHOOL_TEAMS_QUERY = gql`
query ViewerTeams {
    viewerSchool {
        id
        divisions {
            edges {
                node {
                    id
                    name
                    season {
                        name
                        id
                    }
                }
            }
        }
        teams {
            edges {
                node {
                    id
                    name
                    divisionId
                    schoolId
                    currentStudents {
                        edges {
                            node {
                                id
                                first
                                last
                                username
                            }
                        }
                    }

                }
            }
        }
    }
}
`


export const CREATE_TEAM_MUTATION = gql`
mutation CreateTeam($divisionId: ID!, $name: String!, $schoolId: ID) {
    createTeam(name: $name, schoolId: $schoolId, divisionId: $divisionId) {
        team {
            id
            name
            divisionId
            division {
                name
            }
            school {
                name
            }
        }
    }
}
`

export const UPDATE_TEAM_MUTATION = gql`
mutation UpdateTeam($id: ID! $divisionId: ID, $name: String, $schoolId: ID) {
    updateTeam(id: $id, name: $name, schoolId: $schoolId, divisionId: $divisionId) {
        team {
            id
            name
            divisionId
            division {
                name
            }
            school {
                name
            }
        }
    }
}
`

export const SET_TEAM_MEMBERS = gql`
mutation SetTeamMembers($teamId: ID!, $studentIds: [ID]!) {
    setTeamMembers(teamId: $teamId, studentIds: $studentIds) {
        team {
            currentStudents {
                edges {
                    node {
                        id
                        first
                        last
                    }
                }
            }
        }
    }
}
`
