import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'
import {client} from '../../App';
import MaterialTable from 'material-table'
import {useSnackbar} from 'notistack';

import {
    SEASONS_QUERY,
    DIVISIONS_QUERY,
    CREATE_DIVISION,
    UPDATE_DIVISION
} from '../../queries/division';
import {
    SCHOOLS_QUERY,
    CREATE_SCHOOL,
    UPDATE_SCHOOL,
    SCHOOL_GROUPINGS_QUERY
} from '../../queries/student';

import {deglobifyId} from '../../utils/serializers';


const Schools = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [createSchool,] = useMutation(CREATE_SCHOOL, {client: client});
    const [updateSchool,] = useMutation(UPDATE_SCHOOL, {client: client});
    const schoolsQuery = useQuery(SCHOOLS_QUERY, {client: client});
    const {data, refetch, loading, error} = schoolsQuery;
    const schoolGroupingsQuery = useQuery(SCHOOL_GROUPINGS_QUERY, {client:client});
    if (loading)
        return (<div> loading... </div>);
    if (error)
        return (<div> error... </div>);
    return (
        <Typography component={'span'}>
                <br/><br/>
                <MaterialTable
                    title='Schools'
                    options={{
                        // selection: true,
                        pageSize: Math.max(5, Math.min(50, data.schools.edges.length)),
                            pageSizeOptions: [5,10,25,50,100,150]
                    }}
                    columns={[
                        {title: 'Name', field: 'name'},
                        {title: 'ID', field: 'id', editable: 'never'},
                        {title: 'URL/URI', field: 'url'},
                        {
                            title:'School Grouping',
                            field: 'schoolGroupingId',
                            lookup: {
                                ...(schoolGroupingsQuery.data && Object.fromEntries(new Map(schoolGroupingsQuery.data.schoolGroupings.edges.map((edge: any) => [deglobifyId(edge.node.id), `${edge.node.name}` ] )))),
                            }
                        },
                    ]}
                    data={data.schools.edges.map((edge : any) => edge.node)}
                    editable={{
                        isEditable: rowData => true,
                            isDeletable: rowData => false,
                            onRowAdd: newData => {
                                return createSchool(
                                    {variables: newData}).then(refetch) as Promise<any>;
                            },
                            onRowUpdate: (newData, oldData) => {
                                return updateSchool(
                                    {variables: newData}).then(refetch) as Promise<any>;
                            },
                            onRowDelete: oldData => 
                            new Promise((resolve, reject) => {
                                reject();
                                enqueueSnackbar("This operation is not supported!");
                            })
                    }}
                                    />
</Typography>
    )
};

export default Schools
