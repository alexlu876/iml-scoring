import React from 'react';
import {Formik, Field, Form} from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
    useHistory
} from 'react-router-dom';
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
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import libphonenumber from 'google-libphonenumber';

import {REGISTER_MUTATION} from '../../queries/user';
import {useSnackbar} from 'notistack';
import { useQuery, useMutation } from '@apollo/react-hooks';


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
// DO NOT USE arrow functions, changing `this` is very important for Yup

export default function Register() {

    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [registerMutation] = useMutation(REGISTER_MUTATION);

    return (
        <div>
            <Container component="main" maxWidth = "sm"><Paper>
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
                                    registerMutation({variables: values})
                                        .then(
                                            res => {
                                                console.log(res);
                                                history.push("/login");
                                                enqueueSnackbar('Successfully Registered! Log in now to confirm');
                                            },
                                            err => {
                                                console.log(err.message);
                                                setSubmitting(false);
                                                enqueueSnackbar(err.message.split(":")[1]);
                                            });

                                }
                            }
                            render = {
                                ({submitForm, isSubmitting, values, setFieldValue}) => (
                                <Form className={classes.form}>
                                <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        name="first"
                                        type="text"
                                        label="First Name"
                                        component={TextField}
                                        className={classes.field} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        name="last"
                                        type="text"
                                        label="Last Name"
                                        component={TextField}
                                        className={classes.field} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        name="email"
                                        type="email"
                                        label="Email"
                                        component={TextField}
                                        className={classes.field} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        type="password"
                                        label="New Password (Not Email Password!)"
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
                                <Grid item xs={12}>
                                    <Field
                                        type="text"
                                        label="Registration Code"
                                        name="registrationCode"
                                        component={TextField}
                                        className={classes.field}/>
                                    <Field
                                        type="text"
                                        label="Phone Number (Optional)"
                                        name="phoneNum"
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
