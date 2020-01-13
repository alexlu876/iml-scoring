import React from 'react';
import {Formik, Field, Form} from 'formik';
import { makeStyles } from '@material-ui/core/styles';
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
    RadioGroup,
} from 'formik-material-ui';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
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
        alignItems: 'center',
    },
    field: {
        bruh: 'moment',
        width: '96%',
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(1, 1),
        bruh: 'moment',
    },
}));

const validationSchema = Yup.object().shape(
    {
        email: Yup.string()
            .email('Invalid Email Address!'),
    }
);

export default function Register() {

    const classes = useStyles();

    return (
        <div>
            <Container component="main" maxWidth = "xs"><Paper>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                           <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            register
                        </Typography>

                        <Formik
                            validationSchema={validationSchema}
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            onSubmit = {
                                (values, {setSubmitting}) => {
                                    console.log(values);
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
                                        variant="outlined"
                                        className={classes.field} />
                                      <br />
                                    <Field
                                        type="password"
                                        label="Password"
                                        name="password"
                                        variant="outlined"
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

            </Paper></Container>
        </div>



    )
}
