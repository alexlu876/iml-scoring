import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CardTitle from '../../components/CardTitle';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
}));

export default function WelcomePage() {
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <CardTitle>
                Welcome to the NYCIML Scores App!
            </CardTitle>
        </Container>
    )
}
