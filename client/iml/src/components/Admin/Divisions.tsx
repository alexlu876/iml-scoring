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

import {deglobifyId} from '../../utils/serializers';

const Divisions = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [createDivision,] = useMutation(CREATE_DIVISION, {client:client});
    const [updateDivision,] = useMutation(UPDATE_DIVISION, {client: client});
    const divisionsQuery = useQuery(DIVISIONS_QUERY, {client: client});
    const seasonsQuery = useQuery(SEASONS_QUERY, {client: client});
    const {data, refetch, loading, error} = divisionsQuery;
    if (loading)
        return (<div> loading...</div>);
    if (error)
        return (<div> error...</div>);
    return (
        <Typography component={'span'}>
                <br/><br/>
                    <MaterialTable
                        title='Divisions'
                        options={{
                            // selection: true,
                            pageSize: Math.max(5, Math.min(50, data.divisions.edges.length)),
                                pageSizeOptions: [5,10,25,50,100,150]
                        }}
                        columns={[
                            {title: 'Name', field: 'name'},
                            {title: 'ID', field: 'id', editable: 'never'},
                            {
                                title: 'Season', 
                                field: 'seasonId',
                                lookup: seasonsQuery.data && Object.fromEntries(new Map(seasonsQuery.data.seasons.edges.map((edge: any) => [deglobifyId(edge.node.id), edge.node.name]))),
                            },
                            {title: 'URL/URI', field: 'url'},
                            {title: 'Alternate Limit', field:'alternateLimit', type: 'numeric'},
                            {
                                title:'Successor',
                                field: 'successorId',
                                lookup: {
                                    ...(data && Object.fromEntries(new Map(data.divisions.edges.map((edge: any) => [deglobifyId(edge.node.id), `${edge.node.name} (${edge.node.season.name})` ] )))),
                                    '0': 'None'
                                }
                            },
                        ]}
                        data={data.divisions.edges.map((edge : any) => edge.node)}
                        editable={{
                            isEditable: rowData => true,
                                isDeletable: rowData => false,
                                onRowAdd: newData => {
                                    if (newData["successorId"]=='0')
                                        delete newData["successorId"];
                                    console.log(newData);
                                    return createDivision(
                                        {variables: newData}).then(refetch) as Promise<any>;
                                },
                                onRowUpdate: (newData, oldData) => {
                                    if (newData["successorId"]=='0')
                                        delete newData["successorId"];
                                    console.log(newData);
                                    console.log(oldData);
                                    return updateDivision(
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
                            )};

export default Divisions;
