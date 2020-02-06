import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Switch, Route, Link, useParams,  BrowserRouter as Router, Redirect } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {deglobifyId} from '../../utils/serializers';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'
import {
    VIEWER_ATTENDEES_BY_CONTEST,
} from '../../queries/student';
import {
    UPDATE_SCORE,
    CONTEST_BY_ID
} from '../../queries/score';
import ScoreEntryRow from '../../components/Score/ScoreEntryRow';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

export default function ScoreEntryTable() {
	let {id} = useParams();

	const classes = useStyles();
    const attendingStudents = useQuery(VIEWER_ATTENDEES_BY_CONTEST,
        {variables: {contestId: id}});
    const contestInfo = useQuery(CONTEST_BY_ID,
        {variables: {contestId: id}});
    if (attendingStudents.error || contestInfo.error)
        return (<div>error...</div>);
    if (!attendingStudents.data || !contestInfo.data)
        return (<div>loading..</div>);
    return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Team</TableCell>
        {[...Array(contestInfo.data.contest.questionCount)].map((x, i) => {
            return (
                <TableCell key={i+1}>{i+1}</TableCell>
            );
        })}
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendingStudents.data.viewerAttendeesByContest.edges.map((edge:any) => (
              <ScoreEntryRow student={edge.node} contest={contestInfo.data.contest}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
}
