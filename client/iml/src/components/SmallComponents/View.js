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
  var [entries, setEntries] = React.useState([])
  var [viewing, setViewing] = React.useState('');
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
    mutation CreateStudent($first: String!, $last:String!, $graduationYear:Int!, $schoolId:ID!, $divisionId:ID!){
      createStudent(studentInfo:{
        first:$first,
        last:$last,
        graduationYear:$graduationYear
        schoolId:$schoolId,
        divisionId:$divisionId,}) {student {id}}}`
  var DELETE_STUDENT = gql`
    mutation deleteStudent ($id: ID!){
      deleteStudent (id: $id) {id}} `
  var UPDATE_STUDENT = gql`
    mutation UpdateStudent($first: String, $last:String, $graduationYear:Int, $schoolId:ID, $divisionId:ID){
      updateStudent(studentInfo:{
        first:$first,
        last:$last,
        graduationYear:$graduationYear,
        schoolId:$schoolId,
        divisionId:$divisionId,}) {student {id}}}`
  const [createStudent, { data }] = useMutation(CREATE_STUDENT, {client:client})
  const [updateStudent, { data2 }] = useMutation(UPDATE_STUDENT, {client:client})
  //const [deleteStudent, { data3 }] = useMutation(DELETE_STUDENT, {client:client})
  return (
      <Typography component={'span'}>
        <ApolloProvider client={client}>
        <br/><br/>

        <Query query={STUDENTS_QUERY}>
          {({loading, error, data }) => {
              if (error) return (<div>Error</div>)
              if (loading) return (<div>loading...</div>)
              var studentsList = data.students.edges.map((edge) => edge.node)

              return (
                  <MaterialTable
                    title='table of BRUHs'
                    options={{
                      selection: true,
                    }}
                    columns={[
                      {title: 'first', field: 'first'},
                      {title: 'last', field: 'last'},
                      {title: 'graduation year', field:'graduationYear'},
                      {title: 'school', field:'schoolId'},
                      {title: 'division', field:'divisionId'},
                    ]}
                    data={studentsList}
                    editable={{
                      isEditable: rowData => rowData.name != "a", // only name(a) rows would be uneditable
                      isDeletable: rowData => rowData.name == "b", // only name(a) rows would be deletable
                      onRowAdd: newData =>
                          new Promise((resolve, reject) => {
                              setTimeout(() => {
                                  {createStudent({variables: newData})}
                                  resolve();
                              }, 1000);
                          }),
                      onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                              setTimeout(() => {
                                  {updateStudent({variables: newData})}
                                  resolve();
                              }, 1000);
                          }),
                      onRowDelete: oldData =>
                          new Promise((resolve, reject) => {
                              setTimeout(() => {
                                  {
                                    //deleteStudent(1)
                                      /* let data = this.state.data;
                                      const index = data.indexOf(oldData);
                                      data.splice(index, 1);
                                      this.setState({ data }, () => resolve()); */
                                  }
                                  resolve();
                              }, 1000);
                          })
                        }}
                  />
              )
            }}
        </Query>

        <br/>
        add student my dude?

            <div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  createStudent({ variables: {first: first, last:'bruh', graduationYear:420420, schoolId:42069, divisionId:69420} });
                }}
              >
              <input
              value={first}
              onChange={e => {setFirst(e.target.value);}
              }/>
                <button type="submit">Add Todo</button>
              </form>
            </div>
        </ApolloProvider>
    </Typography>
  )
}
