import React from 'react';
import { Query, Mutation} from 'react-apollo'
import { configure } from 'react-apollo-form'
import { useMutation, useApolloClient} from '@apollo/react-hooks'
import {ApolloConsumer, ApolloProvider} from "react-apollo"
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table'
import { forwardRef } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { withApollo } from "react-apollo";
import {client} from '../../App';

export default function View() {
  var [first, setFirst] = React.useState('');
  const USERS_QUERY = gql`
    {
      users {
        edges {
          node {
            id}}}}`
  const STUDENT_QUERY = gql`query{student(id:1){id}}`
  const STUDENTS_QUERY = gql`query{students{
      edges {
        node {
          id
          first
          last }}}}`
  var CREATE_STUDENT = gql`
  mutation CreateStudent($first: String!){
    createStudent(studentInfo:{
      first:$first,
      last:"2",
      graduationYear:42069
      schoolId:200,
      divisionId:2,}) {student {id}}
    }`
  const [createStudent, { data }] = useMutation(CREATE_STUDENT, {client:client})
  return (
      <Typography>
        {console.log(client)}
        <br/><br/>
        <Query query={STUDENTS_QUERY}>
          {({loading, error, data }) => {
              if (error) return (<div>Error</div>)
              if (loading) return (<div>loading...</div>)
              var studentsList = data.students.edges.map((edge) => edge.node)
              return (
                <MaterialTable
                  columns={[
                    {title: 'bruhID', field: 'id'},
                    {title: 'first', field: 'first'},
                    {title: 'last', field: 'last'},
                  ]}
                  data={studentsList}
                  title='BRUH table!!!!!'
                />
              )
            }}
        </Query>
        <br/>
        add student my dude?
        <ApolloProvider client={client}>
            <div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  createStudent({ variables: {first: first } });
                }}
              >
              <input
              value={first}
              onChange={e => {setFirst(e.target.value);
                console.log(e.target.value)}
              }/>
                <button type="submit">Add Todo</button>
              </form>
            </div>
          </ApolloProvider>

    </Typography>
  )
}
