import gql from 'graphql-tag';

export const SEASONS_QUERY = gql`
query AllSeasons(
  $first: Int,
  $after: String) {
    seasons (first: $first after: $after) {
        edges {
            node {
                id
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
              name
              url
          }
      }
  }
`

export const UPDATE_SEASON = gql`
mutation UpdateSeason(
    $id: ID!,
    $name: String,
    $url: String,
    $startDate: Date,
    $endDate: Date) {
      updateSeason(
          id: $id
          name: $name,
          url: $url,
          startDate: $startDate,
          endDate: $endDate
      ) {
          season {
              id
              name
              url
          }
      }
  }
`

export const DIVISIONS_QUERY = gql`
query {
    divisions {
        edges {
            node {
                id
                name
                alternateLimit
                url
                seasonId
                successorId
                season {
                    id
                    name
                }
                contests {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
}
`

export const CREATE_DIVISION = gql`
mutation CreateDivision(
    $alternateLimit: Int!,
    $name: String!,
    $seasonId: ID!,
    $successorId: ID,
    $url: String!,
    ) {
        createDivision(
            seasonId: $seasonId,
            name: $name,
            alternateLimit: $alternateLimit,
            url: $url,
            successorId: $successorId
        ) {
            division {
                id
            }
        }
    }
`

export const UPDATE_DIVISION = gql`
mutation UpdateDivision(
    $id: ID!,
    $alternateLimit: Int,
    $name: String
    $seasonId: ID
    $successorId: ID,
    $url: String
    ) {
        updateDivision(
            id: $id,
            seasonId: $seasonId,
            name: $name,
            alternateLimit: $alternateLimit,
            url: $url,
            successorId: $successorId
        ) {
            division {
                id
            }
        }
    }
`
