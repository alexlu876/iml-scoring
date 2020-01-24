import React from 'react';
import { Query, Mutation} from 'react-apollo'
import { useMutation, useApolloClient} from '@apollo/react-hooks'
import {ApolloConsumer, ApolloProvider} from "react-apollo"
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table'
import { forwardRef } from 'react';

import {
    STUDENTS_QUERY, CREATE_STUDENT, UPDATE_STUDENT,
    DELETE_STUDENT
} from '../../queries/student'

export default function View() {
    const [createStudent,] = useMutation(CREATE_STUDENT)
    const [updateStudent,] = useMutation(UPDATE_STUDENT)
    const [deleteStudent,] = useMutation(DELETE_STUDENT)
    return (
        <Typography component={'span'}>
                <br/><br/>
                <Query query={STUDENTS_QUERY}>
                        {({loading, error, data } : any) => {
                            if (error) return (<div>Error</div>)
                            if (loading) return (<div>loading...</div>)
                            var studentsList = data.students.edges.map((edge : any) => edge.node)

                            return (
                                <MaterialTable
                                    title='All Students'
                                    options={{
                                        // selection: true,
                                    }}
                                    columns={[
                                        {title: 'First Name', field: 'first'},
                                        {title: 'Last Name', field: 'last'},
                                        {title: 'Nickname', field: 'nickname'},
                                        {title: 'Graduation Year', field:'graduationYear', type: 'numeric'},
                                        {title: 'school', field:'schoolId'},
                                        {title: 'division', field:'divisionId'},
                                    ]}
                                    data={studentsList}
                                    editable={{
                                        isEditable: rowData => true,
                                            isDeletable: rowData => true,
                                            onRowAdd: newData => {
                                                return createStudent(
                                                    {variables: newData}) as Promise<any>;
                                            },
                                            onRowUpdate: (newData, oldData) => {
                                                return updateStudent(
                                                    {variables: newData}).then(() => {
                                                    }) as Promise<any>;
                                            },
                                            onRowDelete: oldData => 
                                            new Promise((resolve, reject) => {
                                                reject();
                                            })
                                    }}
                                                    />
                                                            )
                        }}
        </Query>
    </Typography>
    )
}
