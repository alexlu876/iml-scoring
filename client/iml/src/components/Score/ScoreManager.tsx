import React, {Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles'
import ContestScoreUpdate from '../../components/Score/ContestScoreUpdate';
import { Switch, Route, Link, BrowserRouter as Router, Redirect } from "react-router-dom";



const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));
export default function ScoreManager({match, location} : any) {
    const classes = useStyles();
    return (
        <Container className={classes.container} maxWidth="lg">
            <Tabs value={location.pathname}>
                <Tab label="Seasons"
                    component={Link}
                    to={`${match.url}/seasons`}/>
                <Tab label="Divisions"
                    component={Link}
                    to={`${match.url}/divisions`}
                />
            </Tabs>
        <Switch>
            <Route 
                exact
                path={match.url}
                component = {() => <div> </div> } 
            />
            <Route
                path={`${match.url}/:id`}
                component={ContestScoreUpdate} 
                />
        </Switch>
        </Container>
    )
}
