import gql from 'graphql-tag';

export const SEASONS_QUERY = gql`
query AllSeasons(
  $first: Int,
  $after: String) {
    seasons (first: $first after: $after) {
        edges {
            node {
                name
                startDate
                endDate
                url
            }
        }
    }
}
`

export const CREATE_SEASON = gql`
mutation CreateSeason(
  $name: String!,
  $url: String!,
  $startDate: Date!,
  $endDate: Date!) {
      createSeason(
          name: $name,
          url: $url,
          startDate: $startDate,
          endDate: $endDate
      ) {
          season {
              id
              url
          }
      }
  }
`

export const DIVISIONS_QUERY = gql`
query{divisions {
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
