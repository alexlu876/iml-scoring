import React from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import {client} from '../../App';
import {useSnackbar} from 'notistack';

import {VIEWERS_STUDENTS} from '../../queries/student'; 

function StudentsTable() {
    const {enqueueSnackbar} = useSnackbar();
    const {data, loading, error, refetch} = useQuery(VIEWERS_STUDENTS, {client: client});
    if (!data || loading || error)
        return (<div>Loading...</div>)
    return (
        <Typography component={'span'}>
        <MaterialTable
            title='Students'
            options={{
            }}
            columns ={[
                {title: 'First Name', field: 'first'},
                {title: 'Last Name', field: 'last'},
                {title: 'Nickname', field: 'nickname'},
                {
                    title: 'Graduation Year',
                    field:'graduationYear',
                    type: 'numeric'},
            ]}
            data={data ? data.viewerStudents.edges.map((edge: any) => edge.node) : []}
            editable={{
                isEditable: rowData => true,
                    isDeletable: rowData => false,
                    onRowAdd: (newData) => {
                        return new Promise<any>(() => null);
                    },
                    onRowUpdate: (newData, oldData) => {
                        return new Promise<any>(() => null);
                    },
                    onRowDelete: (oldData) => {
                        return new Promise<any>(() => null);
                    }
            }
            }
                        />
        </Typography>
    )
};

export default StudentsTable;

