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
    CONTEST_BY_ID,
    SIMPLE_SCORE_BY_CONTEST
} from '../../queries/score';
import {client} from '../../App';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';

export default function ScoreEntryRow({student, contest}: any) {
    const [state, setState,] = React.useState(
        [...Array(contest.questionCount)].map( (x,i) => {
        return {questionNum: i+1, pointsAwarded: 0};
    }));
    const [isChanged, setChanged] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const scoresQuery = useQuery(
        SIMPLE_SCORE_BY_CONTEST, {client: client, variables: {
            'contestId': contest.id,
            'studentId': student.id
        }});
    const [updateScoresMutation] = useMutation(UPDATE_SCORE, {client: client});
    const updateScoreRow = (index : number, pointsAwarded: number) => {
        setState([ ...state.slice(0,index)
                ,{ ...(state[index]), pointsAwarded: pointsAwarded},
                   ...state.slice(index+1)
        ]);
    }
    const handleChange = (index : number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        updateScoreRow(index, event.target.checked ? 1 : 0);
        setChanged(true);
    };
    const restoreState = () => {
        if (scoresQuery.data) {
            const replacement =  [...Array(contest.questionCount)].map( (x,i) => {
                return {questionNum: i+1, pointsAwarded: 0};
            });
            scoresQuery.data.simpleScoreByContest.forEach((score : any) => {
                replacement[score.questionNum-1] = {
                    questionNum: score.questionNum,
                    pointsAwarded: score.pointsAwarded
                };
            });
            setState(replacement);
        }
    }

    React.useEffect(restoreState, [contest, scoresQuery.data]);

    function handleSync(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        scoresQuery.refetch().then(
            res=> {
                setChanged(false);
                restoreState();
            },
            err=> {
                enqueueSnackbar("Failed to refetch!");
            }
        );
    }

    function handleUpload(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        updateScoresMutation({variables: {
            scores: state,
            contestId: contest.id,
            studentId: student.id,
        }}).then(
            res=> {
                setChanged(false);
                scoresQuery.refetch().then(
                    res=> {}, 
                    err=>{enqueueSnackbar("Error confirming upload!")});
            },
            err=> {
                enqueueSnackbar(err.message.split(":")[1]);
            }
        );
    }
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
                {/* All Actions */}
            <TableCell>
                <IconButton 
                    aria-label="update"
                    onClick={handleUpload}
                >
                    <PublishIcon color={isChanged ? "secondary" : "inherit"}/>
                </IconButton>
                <IconButton
                    aria-label="sync"
                    onClick={handleSync}
                    >
                    <SyncIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
