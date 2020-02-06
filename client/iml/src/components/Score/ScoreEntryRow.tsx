import React from 'react';
import {useSnackbar} from 'notistack';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import {deglobifyId} from '../../utils/serializers';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'
import {
    VIEWER_ATTENDEES_BY_CONTEST,
    STUDENT_CONTEST_ATTENDANCE,
} from '../../queries/student';
import {
    UPDATE_SCORE,
    DELETE_SCORE,
    CONTEST_BY_ID,
    SIMPLE_SCORE_BY_CONTEST
} from '../../queries/score';

import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export default function ScoreEntryRow({student, contest}: any) {
    const [state, setState,] = React.useState(
        [...Array(contest.questionCount)].map( (x,i) => {
        return {questionNum: i+1, pointsAwarded: 0};
    }));
    const [isChanged, setChanged] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const scoresQuery = useQuery(
        SIMPLE_SCORE_BY_CONTEST, {variables: {
            'contestId': contest.id,
            'studentId': student.id
        }});
    const [updateScoresMutation] = useMutation(UPDATE_SCORE);
    const [deleteScoresMutation] = useMutation(DELETE_SCORE);
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
                restoreState();
                setChanged(false);
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
                scoresQuery.refetch().then(
                    res=> {setChanged(false);}, 
                    err=>{enqueueSnackbar("Error confirming upload!")});
            },
            err=> {
                enqueueSnackbar(err.message.split(":")[1]);
            }
        );
    }

    function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        deleteScoresMutation({variables: {
            contestId: contest.id,
            studentId: student.id,
        }}).then(
            res=> {
                setChanged(false);
                /* scoresQuery.refetch().then( */
                /*     res=> {}, */ 
                /*     err=>{enqueueSnackbar("Error confirming deletion!")}); */
            },
            err=> {
                enqueueSnackbar(err.message.split(":")[1]);
            }
        );
    }
    return (
        <TableRow key={student.id}>
            <TableCell component="th" scope="row">
                {`${student.first} ${student.nickname ? `"${student.nickname}" ` : ''}${student.last}`}
            </TableCell>
            <TableCell key={student.id+(student.currentTeamId || 0)}>
                {student.currentTeam && student.currentTeam.name}
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
                <IconButton
                    aria-label="sync"
                    onClick={handleDelete}
                    >
                    <DeleteForeverIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}
