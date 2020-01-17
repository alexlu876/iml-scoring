import React, {Fragment} from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles'
import { Switch, Route, Link, BrowserRouter as Router, Redirect } from "react-router-dom";
import {PrivateRoute} from '../../PrivateRoute';
import {Seasons} from '../../components/Admin/Seasons';
import AllStudents from '../../components/Admin/Students';
import Divisions from '../../components/Admin/Divisions';
import Schools from '../../components/Admin/Schools';
import Coaches from '../../components/Admin/Coaches';
import SchoolGroupings from '../../components/Admin/SchoolGroupings';
const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));
export default function AdminPanel({match, location} : any) {
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
                <Tab
                    label="Schools"
                    component={Link}
                    to={`${match.url}/schools`}
                />
                <Tab
                    label="Coaches"
                    component={Link}
                    to={`${match.url}/coaches`}
                />
                <Tab
                    label="All Students"
                    component={Link}
                    to={`${match.url}/students`}
                />
                <Tab
                    label="School Groupings"
                    component={Link}
                    to={`${match.url}/schoolgroupings`}
                />
            </Tabs>
        <Switch>
            <Route 
                exact
                path={match.url}
                component = {() => <div> </div> } 
            />
            <Route
                path={`${match.url}/seasons`}
                component={Seasons} 
                />
            <Route
                path={`${match.url}/divisions`}
                component={Divisions} 
                />
            <Route
                path={`${match.url}/schools`}
                component={Schools} 
                />
            <Route path={`${match.url}/coaches`}
                component={Coaches} 
                />
            <Route path={`${match.url}/students`}
                component={AllStudents} 
                />
            <Route path={`${match.url}/schoolgroupings`}
                component={SchoolGroupings} 
                />
        </Switch>
        </Container>
    )
}
