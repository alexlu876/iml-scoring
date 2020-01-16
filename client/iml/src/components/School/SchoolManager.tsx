import React, {Fragment} from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles'
import CardTitle from '../../components/CardTitle';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'

import {VIEWER_QUERY, VIEWER_SCHOOLS_QUERY } from '../../queries/user';
import {client} from '../../App';

import StudentsManager from '../../components/School/StudentsManager';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    paperNoPadding: {
    }
}));

const SchoolManager = () => {
    const classes = useStyles();
    const viewerQuery = useQuery(VIEWER_QUERY, {client: client});
    const schoolQuery = useQuery(VIEWER_SCHOOLS_QUERY, {client: client});
    if (!schoolQuery.data || !schoolQuery.data.viewerSchool)
        return (
        <Container className={classes.container} maxWidth="xl">
            No School available.
        </Container>
        )
    return (
        <Container className={classes.container} maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item sm={12} md={8} lg={9}>
                    <Paper className={classes.paperNoPadding} style={{minHeight: 240}}>
                        <StudentsManager/>
                    </Paper>
                </Grid>
                <Grid item sm={12} md={4} lg={3}>
                    <Paper className={classes.paper} style={{minHeight: 240}}>
                        <CardTitle>
                            About
                        </CardTitle>
                        <Typography>
                            {schoolQuery.data && schoolQuery.data.viewerSchool.name}
                            <br/>
                            School Type: {schoolQuery.data.viewerSchool.schoolGrouping.name}
                            <br/>
                            Coaches: {
                                schoolQuery.data.viewerSchool.coaches.edges.map((edge : any) =>
                                    `${edge.node.first} ${edge.node.last}, `) }
                            <br/>
                            Current Divisions: {
                                schoolQuery.data.viewerSchool.divisions.edges.map((edge: any) => 
                                    `${edge.node.name}, `)}
                            <br/>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}
export default SchoolManager;
