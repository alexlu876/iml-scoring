import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable, {MaterialTableProps} from 'material-table';
import {useSnackbar} from 'notistack';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {CONTEST_BY_ID, DIVISION_SCORES_BY_ID} from '../../queries/score';

import {deglobifyId} from '../../utils/serializers';


export const formatData = (division: any) : any => {
    const formattedDataStudent = [] as any[];
    const formattedDataTeam = [] as any[];
    division.contests.edges.forEach((contestEdge : any) => {
        const contestId = deglobifyId(contestEdge.node.id);
        contestEdge.node.scores.edges.forEach((scoreEdge: any) => {
            const score = scoreEdge.node;
            let teamIndex=formattedDataTeam.findIndex(
                (entry: any) => entry.id==score.teamId
            );
            let studentIndex = formattedDataStudent.findIndex(
                (entry: any) => entry.id==score.studentId
            )
            if (teamIndex < 0) {
                formattedDataTeam.push({
                    team: score.team ? score.team.name : 'Unassigned',
                    id: score.teamId,
                    school: score.student.school.name,
                    schoolId: score.student.school.id
                });
                teamIndex = formattedDataTeam.length-1;
            }
            if (studentIndex < 0) {
                formattedDataStudent.push({
                    id: score.studentId,
                    first: score.student.first,
                    last: score.student.last,
                    team: score.student.currentTeam ? score.student.currentTeam.name :'',
                    school: score.student.school.name,
                    schoolId: score.student.school.id,
                });
                studentIndex = formattedDataStudent.length-1;
            }
            formattedDataTeam[teamIndex][''+contestId] = (formattedDataTeam[teamIndex][''+contestId] || 0) + score.pointsAwarded;
            formattedDataTeam[teamIndex]['total'] = (formattedDataTeam[teamIndex]['total'] || 0) + score.pointsAwarded;

            formattedDataStudent[studentIndex][''+contestId] = (formattedDataStudent[studentIndex][''+contestId] || 0) + score.pointsAwarded;
            formattedDataStudent[studentIndex]['total'] = (formattedDataStudent[studentIndex]['total'] || 0) + score.pointsAwarded;
        }
        );
    }
    );
    formattedDataStudent.sort((student1, student2) => -(student1.total-student2.total));
    formattedDataTeam.sort((team1, team2) => -(team1.total-team2.total)); // sort desc
    const occurencesTeam = {} as any;
    const filteredDataTeam=[] as any[];
    formattedDataTeam.forEach((team) => {
        if (team.team=='Unassigned')
            return;
        if (!occurencesTeam[team.schoolId] || occurencesTeam[team.schoolId] < 2) {
            filteredDataTeam.push(team);
            occurencesTeam[team.schoolId] = (occurencesTeam[team.schoolId] ||0) +1;
        }
    });
    const filteredDataStudent = [] as any[];
    const occurencesStudent = {} as any;
    formattedDataStudent.forEach((student:any)  => {
        if (!occurencesStudent[student.schoolId] || occurencesStudent[student.schoolId] < 10) {
            filteredDataStudent.push(student);
            occurencesStudent[student.schoolId] = (occurencesStudent[student.schoolId] || 0) +1;
        }
    });
    return {team: filteredDataTeam, student: filteredDataStudent}
}
const DivisionScoreView = ({id} : any) => {
    const [useTeam, setUseTeam] = React.useState(true); 
    const {enqueueSnackbar} = useSnackbar();
    const { data, refetch, loading, error } = useQuery(DIVISION_SCORES_BY_ID, {variables: {divisionUrl: id}
    });
    const handleModeChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setUseTeam(event.target.checked);
    }
    if (loading)
        return (<div> loading...</div>);
    if (error || !data || !data.division)
        return (<div> error... </div>);
    return ( 
        <Typography component={'span'}>
            <FormControlLabel
                control={
                    <Switch
                        checked={useTeam}
                        onChange={handleModeChange('useTeam')}
                        value='useTeam'
                        inputProps={{ 'aria-label': 'use team or student' }}
                    />
                }
                label="Student/Team"
            />
            <br/>
                <MaterialTable
                    title={`${data.division.name} (${useTeam ? 'Team' : 'Student'})`}
                    options={{
                        // selection: true,
                        pageSize: 10,
                        pageSizeOptions: [5,10,25,50,100,150],
                        exportButton: true

                    }}
                    columns={[
                        ...(useTeam ? []: [{title: 'First Name', field: 'first'},
                        {title: 'Last Name', field: 'last'},]),
                        {title: 'School', field: 'school'},
                        {title: 'Team', field: 'team'},
                        ...(
                            data.division.contests.edges.map(
                                 (edge : any) => {
                                    return {
                                        title: ""+(edge.node.name),
                                        field: ""+(deglobifyId(edge.node.id)),
                                        type: 'numeric'};
                                }
                            )
                        ),
                        {title: 'Total', field: 'total', type: 'numeric'},
                    ]}
                    data={useTeam ? formatData(data.division).team : formatData(data.division).student}
                                    />
        </Typography>
   );
};

export default DivisionScoreView;
