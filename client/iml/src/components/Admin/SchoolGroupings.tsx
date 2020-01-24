import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable from 'material-table';
import {useSnackbar} from 'notistack';

import {
    SCHOOL_GROUPINGS_QUERY,
    UPDATE_SCHOOL_GROUPING,
    CREATE_SCHOOL_GROUPING

} from '../../queries/student';

const SchoolGroupings = () => {
    const {enqueueSnackbar} = useSnackbar();
    const { data, refetch, loading, error } = useQuery(SCHOOL_GROUPINGS_QUERY);
    const [updateSchoolGrouping,] = useMutation(UPDATE_SCHOOL_GROUPING);
    const [createSchoolGrouping,] = useMutation(CREATE_SCHOOL_GROUPING); 
    if (loading)
        return (<div> loading...</div>);
    if (error || !data.schoolGroupings)
        return (<div> error... </div>);
    return (
        <Typography component={'span'}>
            <br/><br/>
                <MaterialTable
                    title='School Groupingss'
                    options={{
                        // selection: true,
                        pageSize: Math.max(5, Math.min(50, data.schoolGroupings.edges.length)),
                            pageSizeOptions: [5,10,25,50,100,150]
                    }}
                    columns={[
                        {title: 'Name', field: 'name'},
                        {title: 'URL', field: 'url'},
                        {title: 'ID', field: 'id', editable: 'never', hidden: true}
                    ]}
                    data={data.schoolGroupings.edges.map((edge : any) => edge.node)}
                    editable={{
                        isEditable: rowData => true,
                            isDeletable: rowData => false,
                            onRowAdd: newData => {
                                return createSchoolGrouping(
                                    {variables: newData}).then(refetch) as Promise<any>;
                            },
                            onRowUpdate: (newData, oldData) => {
                                return updateSchoolGrouping(
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
    );
};



export default SchoolGroupings;
