import React from 'react';
import {useSnackbar} from 'notistack';
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
import {client} from '../../App';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

export default function ScoreEntryRow({student, contest}: any) {
    const [state, setState,] = React.useState(
        [...Array(contest.questionCount)].map( (x,i) => {
        return {questionNum: i+1, pointsAwarded: 0};
    }));
    const {enqueueSnackbar} = useSnackbar();

    const handleChange = (index : number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState([ ...state.slice(0,index)
                ,{ ...(state[index]), pointsAwarded: event.target.checked ? 1 : 0},
                   ...state.slice(index+1)
        ]);
    };

    return (
        <TableRow key={student.id}>
            <TableCell component="th" scope="row">
                {student.username}
            </TableCell>
        {[...Array(contest.questionCount)].map((x,i) => {
            return (
                <TableCell key={i+1}>
                    <Checkbox
                        checked={state[i].pointsAwarded !== 0} 
                        onChange={handleChange(i)} 
                        value="checkedA" />
                </TableCell>
            );
        })}
        </TableRow>
    )
}
