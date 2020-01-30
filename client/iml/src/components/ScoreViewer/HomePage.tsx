import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles'
import CardTitle from '../../components/CardTitle';
import ScoreViewNav from '../../components/ScoreViewer/ScoreViewNav';

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

const HomePage = () => {
    const classes = useStyles();
    return (
        <Container className={classes.container} maxWidth="xl">
            <Grid container spacing={3}>
                <Grid item sm={12} md={2} lg={2}>
                    <ScoreViewNav/>
                </Grid>
                <Grid item sm={12} md={10} lg={10}>
                    <Paper className={classes.paperNoPadding} style={{minHeight: 240}}>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}
export default HomePage;
