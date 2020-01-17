import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {client} from '../../App';
import MaterialTable from 'material-table';
import {useSnackbar} from 'notistack';

import {SCHOOL_GROUPINGS_QUERY} from '../../queries/team';

import {deglobifyId} from '../../utils/serializers';

const SchoolGroupings = () => {
    const {enqueueSnackbar} = useSnackbar();
    const { data, refetch, loading, error } = useQuery(SCHOOL_GROUPINGS_QUERY, {client: client});
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
                        {title: 'ID', field: 'id'}
                    ]}
                    data={data.schoolGroupings.edges.map((edge : any) => edge.node)}
                                    />
                                            </Typography>
    );
};



export default SchoolGroupings;
