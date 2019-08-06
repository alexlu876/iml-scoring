import React from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography';

export default function View() {
  const USERS_QUERY = gql`
    {
      users {
        edges {
          node {
            id
          }
        }
      }
    }
  `

  return (
    <Typography variant="h6">
    bruh <br/> <br/>
    bruh <br/>
    <Query query={USERS_QUERY}>
      {({loading, error, data }: any) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>
          return (
            <div>
              {data['users']['edges']['node']['bruh']}
            </div>
          )
        }}
    </Query>
    </Typography>
  )




}
