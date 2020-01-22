import React from 'react';

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
import {client} from '../../App';

export default function ScoreEntryTable() {
    const {id} = useParams();
    const attendingStudents = useQuery(VIEWER_ATTENDEES_BY_CONTEST,
        {client: client, variables: {contestId: id}});

    if (attendingStudents.error)
        return (<div>error...</div>);
    if (!attendingStudents.data)
        return (<div>loading..</div>);
    return (
        <div>
            {attendingStudents.data.viewerAttendeesByContest.edges.map((edge: any) => (
                <div>{edge.node.username}</div>
                )
            )}
        </div>
    );
}
