import React from 'react';
import {Formik, Field, Form} from 'formik';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
    Button,
    LinearProgress,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
} from '@material-ui/core';
import {useMutation, useQuery} from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import {client} from '../../App';
import {useSnackbar} from 'notistack';

import {VIEWER_SCHOOL_TEAMS_QUERY} from '../../queries/team'; 

export default function TeamsTable() {
    const {enqueueSnackbar} = useSnackbar();
    const {data, loading, error, refetch} = useQuery(VIEWER_SCHOOL_TEAMS_QUERY, {client: client});
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
                {title: 'Division', field: 'divisionId'},
            ]}
            data={data ? data.viewerSchool.teams.edges.map((edge: any) => edge.node) : []}
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
            
            }}
                        />
        </Typography>

            )
}
