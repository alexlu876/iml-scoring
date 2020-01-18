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
