import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable from 'material-table';
import {useSnackbar} from 'notistack';

import {USERS_QUERY} from '../../queries/user';

import {deglobifyId} from '../../utils/serializers';

const RegistrationCodes = () => {
    const {enqueueSnackbar} = useSnackbar();
    const { data, refetch, loading, error } = useQuery(USERS_QUERY);
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
                    ]}
                    data={data.users.edges.map((edge : any) => edge.node)}
                                    />
                                            </Typography>
    );
};

export default RegistrationCodes;
