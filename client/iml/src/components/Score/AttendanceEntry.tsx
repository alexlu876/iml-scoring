import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks';
import {useSnackbar} from 'notistack';
import {client} from '../../App';

import {
    VIEWER_STUDENTS_BY_CONTEST,
    STUDENT_CONTEST_ATTENDANCE,
    UPDATE_CONTEST_ATTENDANCE,
} from '../../queries/student';
import {VIEWER_SCHOOL_TEAMS_QUERY} from '../../queries/team';

export default function AttendanceEntry({studentId, contestId}: any) {
    const [value, setValue] = React.useState('');
    const {enqueueSnackbar} = useSnackbar();
    const studentAttendance = useQuery(
        STUDENT_CONTEST_ATTENDANCE,
        {
            client: client,
            variables: {contestId: contestId, studentId: studentId}
        });
    const viewerTeams = useQuery(VIEWER_SCHOOL_TEAMS_QUERY, {client: client});
    const [updateAttendance, ] = useMutation(UPDATE_CONTEST_ATTENDANCE, {client: client}); 
    if (!studentAttendance.data || !viewerTeams.data)
        return (<div>loading...</div>);
    else {
        //set initial value:
        if (studentAttendance.data.studentContestAttendance) {
            if (!studentAttendance.data.studentContestAttendance.attended) {
                if (value!== 'notAttending')
                    setValue('notAttending');
            }
            else {
                if (!studentAttendance.data.studentContestAttendance.teamId) {
                    if (value!== 'noTeam')
                        setValue('noTeam');
                }
                else if (value!= ""+studentAttendance.data.studentContestAttendance.teamId)
                    setValue(""+studentAttendance.data.studentContestAttendance.teamId);
            }
        }
    }

	const handleChange =
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const valString = (event.target as HTMLInputElement).value;
            const oldValue = value;
            let attended=true;
            if (valString == 'notAttending') {
                attended=false
            }
            setValue(valString);
            if (valString == 'noTeam' || valString == 'notAttending') {
                updateAttendance({variables: {
                    attended: attended,
                    contestId: contestId,
                    studentId: studentId
                }}).then(
                    res => {
                        setValue(valString);
                        studentAttendance.refetch();
                    },
                    err => {
                        enqueueSnackbar(err.message.split(':')[1]);
                        setValue(oldValue);
                    }
                );
            }
            else {
                updateAttendance({variables: {
                    attended: true,
                    teamId: valString,
                    contestId: contestId,
                    studentId: studentId
                }}).then(
                    res => {
                        setValue(valString);
                        studentAttendance.refetch();
                    },
                    err => {
                        enqueueSnackbar(err.message.split(':')[1]);
                        setValue(oldValue);
                    }
                );
            }
        };

    return (
		<FormControl component="fieldset">
		  <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>

              {studentAttendance.data.studentIsAlternate && 
                  viewerTeams.data.viewerSchool.teams.edges.map((edge:any) => (
                      <FormControlLabel
                            key={edge.node.id+""}
                            value={edge.node.id+""}
                            control={(<Radio color="primary" />)}
                            label={edge.node.name}
                            labelPlacement="end"
                          />
                  )
                )}
    {(!studentAttendance.data.studentIsAlternate && studentAttendance.data.student.currentTeamId) ? 
            (<FormControlLabel
                value={""+studentAttendance.data.student.currentTeamId}
                control={<Radio color="primary" />}
                label={studentAttendance.data.student.currentTeam.name}
                labelPlacement="end"
                />) : 
            (<FormControlLabel
                value="noTeam"
                control={<Radio color="primary" />}
                label="Attending (No Team)"
                labelPlacement="end"
            />)
            }
			<FormControlLabel
                value="notAttending"
                control={<Radio color="secondary" />}
                label="Not Attending"
                labelPlacement="end"
			/>
		  </RadioGroup>
		</FormControl>
    )
}
