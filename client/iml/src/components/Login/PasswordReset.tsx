import React from 'react';
import {Redirect} from 'react-router-dom';
import {Formik, Field, Form} from 'formik';
import {
  Button,
} from '@material-ui/core';
import * as Yup from 'yup';

import { useMutation, useApolloClient} from '@apollo/react-hooks'
import { useSnackbar } from 'notistack';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import {
  TextField,
} from 'formik-material-ui';

import {PASSWORD_RESET_MUTATION} from '../../queries/user';
import {
    getTokenIdentifier,
    getLocalAccessToken,
    setLocalAccessToken,
    setLocalRefreshToken,
    isLoggedIn,
} from '../../Auth';
import {
    useHistory,
    Link as RouterLink,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '96%', // Fix IE 11 issue.
        margin: theme.spacing(3,1,1,1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submit: {
        margin: theme.spacing(3, 1, 2, 1),
    },
    field: {
        width: '100%',
    },
}));

const validationSchema = Yup.object().shape(
    {
        password: Yup.string().required('Password is required.').min(6, "Must be at least 6 characters!"),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match.').required('Password must be confirmed.'),
    }
);

const PasswordReset =  () => {
    const classes = useStyles();

    const [resetPassword,] = useMutation(PASSWORD_RESET_MUTATION);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    if (isLoggedIn())
        return (
            <Redirect to="/"/>
        );
    return (
        <div>
            <Container component="main" maxWidth = "sm">
                <Paper>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                           <LockOutlinedIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            Reset Password With Emailed Code
                        </Typography>

        <Formik
            validationSchema={validationSchema}
            initialValues={{
                code: '',
                password: '',
                confirmPassword: '',
            }}
            onSubmit = {
                (values, {setSubmitting}) => {
                    return resetPassword({variables: values})
                        .then(
                            res => {
                                console.log(res);
                                setSubmitting(false);
                                history.push("/login");
                                enqueueSnackbar("Password Reset!");
                            },
                            err => {
                                setSubmitting(false);
                                enqueueSnackbar(err.message.split(':')[1]);
                            }
                        )
                        .then(() => {
                            setSubmitting(false);
                        });
                }
            }
            render = {
                ({submitForm, isSubmitting, values, setFieldValue}) => (
                <Form className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                type="text"
                                label="Password Reset Code (as emailed)"
                                name="code"
                                component={TextField}
                                className={classes.field}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                type="password"
                                label="New Password"
                                name="password"
                                component={TextField}
                                className={classes.field}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                type="password"
                                label="Confirm Password"
                                name="confirmPassword"
                                component={TextField}
                                className={classes.field}/>
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        onClick={submitForm}
                        className={classes.submit}>
                        Reset Password
                    </Button>
                </Form>
                )
            }
        />
        </div>
        </Paper>
        </Container>
        </div>
                );
}

export default PasswordReset;
