import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CardTitle from '../../components/CardTitle';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from '../../utils/Markdown';
import welcome from '../../components/ScoreViewer/welcome';


const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
}));

export default function WelcomePage() {
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <CardTitle>
                Welcome to the NYCIML Scores App!
            </CardTitle>
            <Markdown className={classes.markdown} key={welcome.substring(0,40)}>
                {welcome}
            </Markdown>
        </Container>
    )
}
