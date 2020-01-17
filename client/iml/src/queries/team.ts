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
        teams {
            edges {
                node {
                    id
                    name
                    divisionId
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
