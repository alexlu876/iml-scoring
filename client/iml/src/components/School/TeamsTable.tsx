import React from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import {client} from '../../App';
import {useSnackbar} from 'notistack';

import {
    VIEWER_SCHOOL_TEAMS_QUERY,
    CREATE_TEAM_MUTATION,
    UPDATE_TEAM_MUTATION
} from '../../queries/team'; 
import {deglobifyId} from '../../utils/serializers';

export default function TeamsTable() {
    const {enqueueSnackbar} = useSnackbar();
    const {data, loading, error, refetch} = useQuery(VIEWER_SCHOOL_TEAMS_QUERY, {client: client});
    const [createTeam,] = useMutation(CREATE_TEAM_MUTATION, {client: client});
    const [updateTeam,] = useMutation(UPDATE_TEAM_MUTATION, {client: client});
    if (!data || loading || error)
        return (<div>Loading... {''+error || ''}</div>)
    return (
        <Typography component={'span'}>
        <MaterialTable
            title='Teams'
            options={{
            }}
            columns ={[
                {title: 'Name', field: 'name'},
                {title: 'ID', field: 'id', hidden: true, editable: 'never'},
                {
                    title: 'Division',
                    field:'divisionId',
                    editable: 'onAdd',
                    lookup: data && Object.fromEntries(new Map(data.viewerSchool.divisions.edges.map((edge: any) => [deglobifyId(edge.node.id), `${edge.node.name} (${edge.node.season.name})` ] )))
                }
            ]}
            data={data ? data.viewerSchool.teams.edges.map((edge: any) => edge.node) : []}
            editable={{
                isEditable: rowData => true,
                    isDeletable: rowData => false,
                    onRowAdd: (newData) => {
                        return createTeam({ variables: newData}).then(refetch) as Promise<any>;
                    },
                    onRowUpdate: (newData, oldData) => {
                        return updateTeam({ variables: newData}).then(refetch) as Promise<any>;
                    },
                    onRowDelete: (oldData) => {
                        return new Promise<any>(() => null);
                    }
            
            }}
                        />
        </Typography>

            )
}
