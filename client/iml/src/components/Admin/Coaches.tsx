import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {client} from '../../App';
import MaterialTable from 'material-table';
import {useSnackbar} from 'notistack';

import {USERS_QUERY} from '../../queries/user';

import {deglobifyId} from '../../utils/serializers';

const Coaches = () => {
    const {enqueueSnackbar} = useSnackbar();
    const { data, refetch, loading, error } = useQuery(USERS_QUERY, {client: client});
    if (loading)
        return (<div> loading...</div>);
    if (error || !data.users)
        return (<div> error... </div>);
    return (
        <Typography component={'span'}>
            <br/><br/>
                <MaterialTable
                    title='Users'
                    options={{
                        // selection: true,
                        pageSize: Math.max(5, Math.min(50, data.users.edges.length)),
                            pageSizeOptions: [5,10,25,50,100,150]
                    }}
                    columns={[
                        {title: 'First Name', field: 'first'},
                        {title: 'Last Name', field: 'last'},
                        {title: 'Username', field: 'username'},
                        {title: 'Approval Status', field: 'approvalStatus'},
                        {title: 'Is Admin?', field:'isAdmin', type:'boolean'},
                        {title: 'Phone #', field: 'phoneNum'},
                        {title: 'Email', field: 'email'},
                        {title: 'ID', field: 'id', hidden: true, editable: 'never'},
                    ]}
                    data={data.users.edges.map((edge : any) => edge.node)}
                                    />
                                            </Typography>
    );
};



export default Coaches;
