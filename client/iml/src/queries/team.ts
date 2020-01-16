import gql from 'graphql-tag';

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
