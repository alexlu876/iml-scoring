import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles'
import CardTitle from '../../components/CardTitle';
import ScoreViewNav from '../../components/ScoreViewer/ScoreViewNav';
import ContestScoreView from '../../components/ScoreViewer/ContestScoreView';
import { Switch, Route, Link, BrowserRouter as Router, Redirect } from "react-router-dom";
import WelcomePage from '../../components/ScoreViewer/WelcomePage';

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

const HomePage = ({match, location} : any) => {
    const classes = useStyles();
    return (
        <Container className={classes.container} maxWidth="xl">
            <Grid container spacing={3}>
                <Grid item sm={12} md={2} lg={2}>
                    <ScoreViewNav/>
                </Grid>
                <Grid item sm={12} md={10} lg={10}>
                    <Paper className={classes.paperNoPadding} style={{minHeight: 240}}>
                        <Route
                            exact
                            path={'/scores/view'}
                            component={WelcomePage}
                        />
                        <Route
                            path={`/scores/view/:divisionId/:contestId`}
                            component={function({match} : any) {return <ContestScoreView id={match.params.contestId} />}} 
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}
export default HomePage;
