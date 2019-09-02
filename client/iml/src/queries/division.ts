import gql from 'graphql-tag';

export const SEASONS_QUERY = 
gql`query{
    seasons {
        edges {
            node {
                name
            }
        }
    }
}
`

export const DIVISIONS_QUERY = gql`query{divisions {
    edges {
        node {
            name
            alternateLimit
            url
            season {
                name
            }
        }
    }
}
}
`
