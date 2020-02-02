import React, {Fragment} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Container from '@material-ui/core/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Switch, Route, Link, useParams, useHistory, BrowserRouter as Router, Redirect } from "react-router-dom";

import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks';
import {useSnackbar} from 'notistack';

import {
    VIEWER_STUDENTS_BY_CONTEST,
    STUDENT_CONTEST_ATTENDANCE,
    UPDATE_CONTEST_ATTENDANCE,
} from '../../queries/student';
import {VIEWER_SCHOOL_TEAMS_QUERY} from '../../queries/team';
import AttendanceTable from '../../components/Score/AttendanceTable';
import ScoreEntryTable from '../../components/Score/ScoreEntryTable';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {VIEWER_CONTESTS_QUERY} from '../../queries/division';
import {deglobifyId} from '../../utils/serializers';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        buttons: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(2),
            alignItems: 'right',
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            align: 'center',
        },

    }),
);

function getSteps() {
    return ['Manage Attendance', 'Enter Scores'];
}

function getStepContent(stepIndex: number) {
    switch (stepIndex) {
        case 0:
            return (<AttendanceTable/>);
        case 1:
                return (<ScoreEntryTable/>);
        default:
            return 'Unknown stepIndex';
    }
}


export default function ContestScoreUpdate() {
    const {id} = useParams();
	const classes = useStyles();
    const history = useHistory();
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = getSteps();
    const {error, refetch} = useQuery(VIEWER_STUDENTS_BY_CONTEST,{variables: {contestId: id}});

    const contestsQuery = useQuery(VIEWER_CONTESTS_QUERY); 
    const {data} = contestsQuery;

	const handleNext = () => {
        refetch().then(res=>{}, err=>{});
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};
    
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        history.push(`/scores/add/${event.target.value as number}`);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const Selector = () => {
        return (
            <FormControl className={classes.formControl}>
                <InputLabel color="secondary" htmlFor="grouped-select">Contest</InputLabel>
                <Select 
                    color="secondary"
                    value={id}
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    onChange={handleChange}
                    input={<Input id="grouped-select" />}
                >
                    {data && data.viewerSchool.divisions.edges.map(
                        (edge : any) => {
                            return [
                                (<ListSubheader key={edge.node.id}>
                                    {edge.node.name}
                                </ListSubheader>),
                                ...(edge.node.contests.edges.map(
                                    (contestEdge: any) => (
                                        <MenuItem
                                            value={deglobifyId(contestEdge.node.id)}
                                            key={contestEdge.node.id}>{contestEdge.node.name}
                                        </MenuItem>
                                    )
                                ))
                            ]
                    }
                    )}
                </Select>
            </FormControl>
        );
    }
    if (!id || error) return (<Selector/>);
	return (
		<div className={classes.root}>
            
            <Selector/>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                        <div className = {classes.buttons}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.backButton}
                            >
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );



}
