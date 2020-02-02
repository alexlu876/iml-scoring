import React, {Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles'
import ContestScoreUpdate from '../../components/Score/ContestScoreUpdate';
import { Switch, useParams, useHistory, Route, Link, BrowserRouter as Router, Redirect } from "react-router-dom";
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {useQuery} from '@apollo/react-hooks';
import {VIEWER_CONTESTS_QUERY} from '../../queries/division';
import {deglobifyId} from '../../utils/serializers';



const useStyles = makeStyles(theme => ({
    paper: {
        marginBottom: theme.spacing(12),
    },
    container: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
    },
}));
export default function ScoreManager({match, location} : any) {
    const classes = useStyles();
    const {id} = useParams();


    return (
        <Container className={classes.container} maxWidth="lg">
        <Paper className={classes.paper}>

            <Switch>
                <Route 
                    exact
                    path={match.url}
                    component = {ContestScoreUpdate} 
                />
                <Route
                    path={`${match.url}/:id`}
                    component={ContestScoreUpdate} 
                />
            </Switch>
        </Paper>
        </Container>
    )
}
