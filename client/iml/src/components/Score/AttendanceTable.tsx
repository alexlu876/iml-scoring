import React, {Fragment} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {deglobifyId} from '../../utils/serializers';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'
import { Switch, Route, Link, useParams,  BrowserRouter as Router, Redirect } from "react-router-dom";

import {
    VIEWER_STUDENTS_BY_CONTEST,
    STUDENT_CONTEST_ATTENDANCE
} from '../../queries/student';

import AttendanceEntry from '../../components/Score/AttendanceEntry';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});


export default function AttendanceTable() {
	let {id} = useParams();

	const classes = useStyles();
	const rows = [{}];
    const eligibleStudents = useQuery(VIEWER_STUDENTS_BY_CONTEST, 
        {variables: {contestId: id} }
    )
    if (!eligibleStudents.data)
        return (<div>loading...</div>)

	return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eligibleStudents.data.viewerStudentsByContest.edges.map((edge:any) => (
            <TableRow key={edge.node.id}>
              <TableCell component="th" scope="row">
                {edge.node.username}
              </TableCell>
              <TableCell align="left">
                  <AttendanceEntry 
                      studentId={deglobifyId(edge.node.id)}
                      contestId={id}
                  />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
