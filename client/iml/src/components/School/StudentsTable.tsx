import React from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import {useSnackbar} from 'notistack';
import {deglobifyId} from '../../utils/serializers';

import {
    VIEWERS_STUDENTS,
    UPDATE_STUDENT,
    CREATE_STUDENT
} from '../../queries/student'; 
import {VIEWER_SCHOOL_TEAMS_QUERY} from '../../queries/team';

function StudentsTable() {
    const {enqueueSnackbar} = useSnackbar();
    const {data, loading, error, refetch} = useQuery(VIEWERS_STUDENTS);
    const [updateStudent] = useMutation(UPDATE_STUDENT);
    const [createStudent] = useMutation(CREATE_STUDENT);
    const viewerSchool = useQuery(VIEWER_SCHOOL_TEAMS_QUERY); 
    if (!data || loading || error)
        return (<div>Loading...</div>)
    return (
        <Typography component={'span'}>
        <MaterialTable
            title='Students'
            options={{
                pageSize: Math.max(10, Math.min(25, data.viewerStudents ? data.viewerStudents.edges.length + 5: 0)),
                pageSizeOptions: [5,10,25,50,100,150]
            }}
            columns ={[
                {title: 'First Name', field: 'first'},
                {title: 'id', field: 'id', hidden: true, editable: 'never'},
                {title: 'schoolId', field: 'schoolId', hidden: true, editable: 'never'},
                {title: 'Last Name', field: 'last'},
                {title: 'Nickname', field: 'nickname'},
                {
                    title: 'Graduation Year',
                    field:'graduationYear',
                    type: 'numeric'
                },
                {
                    title: 'Current Division',
                    field:'currentDivisionId',
                    lookup: (viewerSchool.data && viewerSchool.data.viewerSchool && Object.fromEntries(new Map(viewerSchool.data.viewerSchool.divisions.edges.map((edge: any) => [deglobifyId(edge.node.id), `${edge.node.name} (${edge.node.season.name})` ] ))))
                },
                {title: 
                    'Current Division Alternate?', 
                    field: 'isAlternate', 
                    type:'boolean',

                },
            ]}
        data={data ? data.viewerStudents.edges.map((edge: any) => 
            {return {
                ...edge.node,
                isAlternate: edge.node.currentDivisionAssoc ? edge.node.currentDivisionAssoc.isAlternate : false
            };
            }) : []}
            editable={{
                isEditable: rowData => true,
                    isDeletable: rowData => false,
                    onRowAdd: (newData) => {
                        if (!newData.currentDivisionId) {
                            return new Promise((resolve, reject) => {
                                reject();
                                enqueueSnackbar("Please specify a division!");
                            });
                        }
                        return createStudent({
                            variables: newData,
                            refetchQueries: [{
                                query: VIEWER_SCHOOL_TEAMS_QUERY
                            }]}).then(
                            res=> {refetch()},
                            err=> {enqueueSnackbar(err.message.split(":")[1])}
                        ) as Promise<any>;
                    },
                    onRowUpdate: (newData, oldData) => {
                        return updateStudent({
                            variables: newData,
                            refetchQueries: [{
                                query: VIEWER_SCHOOL_TEAMS_QUERY
                            }]}).then(
                            res=> {refetch()},
                            err=> {enqueueSnackbar(err.message.split(":")[1])}
                        ) as Promise<any>;
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

