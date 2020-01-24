import React from 'react';
import {Redirect} from 'react-router-dom';
import {Formik, Field, Form} from 'formik';
import {
  Button,
  LinearProgress,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
} from '@material-ui/core';
import * as Yup from 'yup';
import MuiTextField from '@material-ui/core/TextField';
import {
  fieldToTextField,
  TextField,
  TextFieldProps,
  Select,
  Switch,
} from 'formik-material-ui';

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';

import { useMutation, useApolloClient} from '@apollo/react-hooks'
import { useSnackbar } from 'notistack';

import {AUTH} from '../../queries/user';
import {
    getTokenIdentifier,
    getLocalAccessToken,
    setLocalAccessToken,
    setLocalRefreshToken,
    isLoggedIn,
} from '../../Auth';
import {
    useHistory
} from 'react-router-dom';

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
}));


const validationSchema = Yup.object().shape(
    {
        email: Yup.string()
            .email('Invalid Email Address!'),
    }
);

export const Login = (redirect : string | undefined) => {
    const classes = useStyles();

    const [authUser,] = useMutation(AUTH);
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
                    <CssBaseline/>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                           <LockOutlinedIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                        </Typography>

        <Formik
            validationSchema={validationSchema}
            initialValues={{
                email: getTokenIdentifier(getLocalAccessToken() || '') || '',
                password: '',
            }}
            onSubmit = {
                (values, {setSubmitting}) => {
                    return authUser({variables: values})
                        .then(
                            res => {
                                console.log(res);
                                var data = res.data.auth;
                                setLocalAccessToken(data.accessToken);
                                setLocalRefreshToken(data.refreshToken);
                                redirect ? history.push(redirect) : history.push("");
                                enqueueSnackbar('Successfully Logged In!');
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
                    <Field
                        type="password"
                        label="Password"
                        name="password"
                        margin="normal"
                        component={TextField}
                        className={classes.field}/>
                      <br />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                        className={classes.submit}>
                        Submit
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

export default Login;
