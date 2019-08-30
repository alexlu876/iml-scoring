import gql from 'graphql-tag';


export const DIVISIONS_QUERY = gql`divisions {
    edges {
        node {
            name
        }
    }
}
`
