import React from 'react';
import { Query, Mutation} from 'react-apollo'
import { configure } from 'react-apollo-form'
import { useMutation, useQuery, useApolloClient} from '@apollo/react-hooks'
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

import {
    STUDENTS_QUERY, CREATE_STUDENT, UPDATE_STUDENT,
    DELETE_STUDENT
} from '../../queries/student'
import {
    DIVISIONS_QUERY
} from '../../queries/division';

export default function AllStudents() {
    const [createStudent,] = useMutation(CREATE_STUDENT, {client:client});
    const [updateStudent,] = useMutation(UPDATE_STUDENT, {client:client});
    const [deleteStudent,] = useMutation(DELETE_STUDENT, {client:client});
    return (
        <Typography component={'span'}>
                <br/><br/>
                <Query query={STUDENTS_QUERY}>
                        {({loading, error, data, refetch} : any) => {
                            if (error) return (<div>Error</div>)
                            if (loading) return (<div>loading...</div>)
                            return (
                                <MaterialTable
                                    title='All Students'
                                    options={{
                                        // selection: true,
                                        pageSize: Math.max(5, Math.min(50, data.students.edges.length)),
                                        pageSizeOptions: [5,10,25,50,100,150]
                                    }}
                                    columns={[
                                        {title: 'First Name', field: 'first'},
                                        {title: 'Last Name', field: 'last'},
                                        {title: 'Nickname', field: 'nickname'},
                                        {title: 'Graduation Year', field:'graduationYear', type: 'numeric'},
                                        {
                                            title: 'School',
                                            field:'schoolId',
                                            lookup: {
                                                                                                
                                            }
                                        },
                                        {title: 'Division', field:'divisionId'},
                                    ]}
                                    data={data.students.edges.map((edge : any) => edge.node)}
                                    editable={{
                                        isEditable: rowData => true,
                                            isDeletable: rowData => false,
                                            onRowAdd: newData => {
                                                return createStudent(
                                                    {variables: newData}) as Promise<any>;
                                            },
                                            onRowUpdate: (newData, oldData) => {
                                                return updateStudent(
                                                    {variables: newData}).then(refetch) as Promise<any>;
                                            },
                                            onRowDelete: oldData => 
                                            new Promise((resolve, reject) => {
                                                reject();
                                            })
                                    }}
                                                    />
                                                            
                            )}}
        </Query>
    </Typography>
    )
}