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
import libphonenumber from 'google-libphonenumber';



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
            .required('Email is required.')
            .email('Invalid Email Address!'),
        password: Yup.string().required('Password is required.'),
        confirmPassword: Yup.string()
             .oneOf([Yup.ref('password'), null], 'Passwords must match.').required('Password must be confirmed.'),
        first: Yup.string().required('First name required.'),
        last: Yup.string().required('Last name required.'),
        registrationCode: Yup.string().required('Registration code required.'),
        phoneNum: Yup.string().test('phone-num', 'Use a valid US phone number!', function (value: any) : boolean {
            const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
            if (!value || !value.length)
                return true;
            try {
            const num = phoneUtil.parseAndKeepRawInput(''+value, 'US');
            if (!num)
                return false;
                return phoneUtil.isValidNumber(num);
            }
            catch (err) {
                return false;
            }
        })
    }
);
// DO NOT USE arrow functions, changing this() is very important for Yup

export default function Register() {

    const classes = useStyles();

    return (
        <div>
            <Container component="main" maxWidth = "md"><Paper>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                           <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Register
                        </Typography>

                        <Formik
                            validationSchema={validationSchema}
                            initialValues={{
                                    email: '',
                                    password: '',
                                    confirmPassword: '',
                                    first: '',
                                    last: '',
                                    registrationCode: '',
                                    phoneNum: ''
                            }}
                            onSubmit = {
                                (values, {setSubmitting}) => {
                                    console.log(values);
                                    setSubmitting(false);
                                }
                            }
                            render = {
                                ({submitForm, isSubmitting, values, setFieldValue}) => (
                                <Form className={classes.form}>
                                    <Field
                                        name="first"
                                        type="text"
                                        label="First Name"
                                        component={TextField}
                                        className={classes.field} />
                                      <br />
                                    <Field
                                        name="last"
                                        type="text"
                                        label="Last Name"
                                        component={TextField}
                                        className={classes.field} />
                                      <br />
                                    <Field
                                        name="email"
                                        type="email"
                                        label="Email"
                                        component={TextField}
                                        className={classes.field} />
                                      <br />
                                    <Field
                                        type="password"
                                        label="New Password (Not Email Password!)"
                                        name="password"
                                        component={TextField}
                                        className={classes.field}/>
                                      <br />
                                    <Field
                                        type="password"
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        component={TextField}
                                        className={classes.field}/>
                                      <br />
                                    <Field
                                        type="text"
                                        label="Registration Code"
                                        name="registrationCode"
                                        component={TextField}
                                        className={classes.field}/>
                                      <br />
                                    <Field
                                        type="text"
                                        label="Phone Number (Optional)"
                                        name="phoneNum"
                                        component={TextField}
                                        className={classes.field}/>
                                      <br />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        className={classes.submit}>
                                        Create Account
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
