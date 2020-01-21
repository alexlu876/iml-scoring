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
import { Switch, Route, Link, useParams,  BrowserRouter as Router, Redirect } from "react-router-dom";

import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks';
import {useSnackbar} from 'notistack';
import {client} from '../../App';

import {
    VIEWER_STUDENTS_BY_CONTEST,
    STUDENT_CONTEST_ATTENDANCE,
    UPDATE_CONTEST_ATTENDANCE,
} from '../../queries/student';
import {VIEWER_SCHOOL_TEAMS_QUERY} from '../../queries/team';
import AttendanceTable from '../../components/Score/AttendanceTable';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
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
            return (<div>bruh</div>);
        default:
            return 'Unknown stepIndex';
    }
}


export default function ContestScoreUpdate() {
    const {id} = useParams();
	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = getSteps();
    const {refetch} = useQuery(VIEWER_STUDENTS_BY_CONTEST,{client: client, variables: {contestId: id}});

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
	return (
		<div className={classes.root}>
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
				<div>
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
