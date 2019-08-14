import React from 'react';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table'
import { forwardRef } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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
  const STUDENT_QUERY = gql`query{student(id:1){id}}`
  const STUDENTS_QUERY = gql`query{students{
      edges {
        node {
          id
          first
          last
        }
      }
    }}`

  return (
    <Typography variant="h6">
      <br/><br/>
      <Query query={STUDENTS_QUERY}>
        {({loading, error, data }: any) => {
            if (loading) return <div>Fetching</div>
            if (error) return <div>Error</div>
            var studentsList = data.students.edges.map((edge:any) => edge.node)
            console.log(studentsList)
            return (
              <MaterialTable
                columns={[
                  {title: 'bruhname', field: 'id'},
                  {title: 'first', field: 'first'},
                  {title: 'last', field: 'last'},
                ]}
                data={studentsList}
                title='BRUH table!!!!!'
              />
            )
          }}
      </Query>
    </Typography>
  )


}
