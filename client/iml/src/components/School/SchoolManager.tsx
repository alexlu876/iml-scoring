import React, {Fragment} from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

const SchoolManager = () => {
    const classes = useStyles();
    return (
        <Container className={classes.container} maxWidth="lg">
        </Container>
    )
}
export default SchoolManager;
