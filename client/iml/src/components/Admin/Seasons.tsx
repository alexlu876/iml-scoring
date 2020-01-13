import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import {Query} from 'react-apollo';
import moment from 'moment';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'

import {client} from '../../App';
import {
    SEASONS_QUERY,
    CREATE_SEASON,
    UPDATE_SEASON
} from '../../queries/division';

export function  Seasons() {
    const { loading, error, data, refetch } = useQuery(
        SEASONS_QUERY,
        {client: client}
    );
    const [createSeason,] = useMutation(CREATE_SEASON,
        {client: client}
    );
    const [updateSeason,] = useMutation(UPDATE_SEASON,
        {client: client}
    );
    const edgeMapper = () => {return [];};
    if (loading) return (<div>loading...</div>);
    if (error) return (<div>error...</div>);
    return (
        <Typography component='span'>
        <br/> <br/>
        <MaterialTable
            title='Seasons'
            options={{
            }}
            columns ={[
                {title: 'Name', field: 'name'},
                {title: 'URL', field: 'url'},
                {title: 'ID', field: 'id', hidden: true},
                {title: 'Start Time',
                    field: 'startDate',
                    type: 'date',
                    render: rowData => 
                    new Date(rowData.startDate).toDateString(),
                },
                {title: 'End Time',
                    field: 'endDate',
                    type: 'date',
                    render: rowData => 
                    new Date(rowData.endDate).toDateString(),
                }
            ]}
            data={data ? data.seasons.edges.map((edge: any) => edge.node) : null}
            editable={{
                isEditable: rowData => true,
                    isDeletable: rowData => false,
                    onRowAdd: (newData) => {
                        newData.startDate
                            = moment(newData.startDate).format("YYYY-MM-DD");
                        newData.endDate
                            = moment(newData.endDate).format("YYYY-MM-DD");
                        return createSeason({variables: newData}).then(refetch) as Promise<any>;
                    },
                    onRowUpdate: (newData, oldData) => {
                        newData.startDate
                            = moment(newData.startDate).format("YYYY-MM-DD");
                        newData.endDate
                            = moment(newData.endDate).format("YYYY-MM-DD");
                        return updateSeason({variables: newData}).then(refetch) as Promise<any>;
                    },
                    onRowDelete: (oldData) => {
                        return new Promise<any>(() => null);
                    }
            }
            }
                        />
            </Typography>
    );
}

