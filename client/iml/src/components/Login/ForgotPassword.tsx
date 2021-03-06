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

import {FORGOT_PASSWORD_MUTATION} from '../../queries/user';
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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submit: {
        marginBottom: theme.spacing(1)
    },
    field: {
        width: '50%',
        margin: theme.spacing(0, 1, 0, 1),
    },
    instructions: {
        width: '52%',
        margin: theme.spacing(0, 0, 4, 0),
    }
}));

const validationSchema = Yup.object().shape(
    {
    }
);

const ForgotPassword =  () => {
    const classes = useStyles();

    const [authUser,] = useMutation(FORGOT_PASSWORD_MUTATION);
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
                            Reload
                        </Typography>

        <Formik
            validationSchema={validationSchema}
            initialValues={{
                email: getTokenIdentifier(getLocalAccessToken() || '') || '',
            }}
            onSubmit = {
                (values, {setSubmitting}) => {
                    return authUser({variables: values})
                        .then(
                            res => {
                                console.log(res);
                                setSubmitting(false);
                                history.push("/reset_password");
                                enqueueSnackbar("Email sent!");
                            },
                            err => {
                                setSubmitting(false);
                                enqueueSnackbar('Invalid Login!');
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
                    <Field
                        name="email"
                        type="email"
                        label="Email"
                        component={TextField}
                        className={classes.field} />
                      <br />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        onClick={submitForm}
                        className={classes.submit}>
                        Send Email
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

export default ForgotPassword;
