import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import {Query} from 'react-apollo';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'

import {client} from '../../App';
import {
    SEASONS_QUERY,
    CREATE_SEASON
} from '../../queries/division';

export function  Seasons() {
    const { loading, error, data } = useQuery(
        SEASONS_QUERY,
        {client: client}
    );
    const [createSeason,] = useMutation(CREATE_SEASON,
        {client: client}
    )
    {/* const edgeMapper = () => data.seasons.edges.map( */}
    {/*     (edge : any) => edge.node */}
    {/* ) */}
    const edgeMapper = () => {return [];};
    if (loading) return (<div></div>);
    if (error) return (<div></div>);
    var seasons = data.seasons.edges.map(
        (edge : any) => edge.node
    );
    return (
        <MaterialTable
            title='Seasons'
            options={{
            }}
            columns ={[
                {title: 'Name', field: 'name'},
                {title: 'URL', field: 'url'},
                {title: 'Start Time',
                    field: 'startTime',
                    type: 'date',
                    render: rowData => 'bruh'
                },
                {title: 'End Time',
                    field: 'endTime',
                    type: 'date',
                    render: rowData => 'bruh'
                }
            ]}
            data={seasons}
            editable={{
                isEditable: rowData => true,
                    isDeletable: rowData => true,
                    onRowAdd: (newData) => {
                        console.log(newData);
                        return createSeason({variables: newData}) as Promise<any>},
                    onRowUpdate: (newData, oldData) => {
                        return new Promise<any>(() => null);
                    },
                    onRowDelete: (oldData) => {
                        return new Promise<any>(() => null);
                    }
            }
            }
        />
    );
}

