import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable, {MaterialTableProps} from 'material-table';
import {useSnackbar} from 'notistack';

import {CONTEST_BY_ID} from '../../queries/score';

import {deglobifyId} from '../../utils/serializers';

export const formatData = (data : any) : any => {
    const formattedDataStudent = [] as any[];
    const formattedDataTeam = [] as any[];
    data.scores.edges.forEach((edge : any) => {
        const score = edge.node;
        let index=formattedDataStudent.findIndex(
            (entry: any) =>
            entry.id==score.studentId
        );
        let teamIndex = formattedDataTeam.findIndex(
            (entry : any) => entry.id==score.teamId
        );
        if (teamIndex < 0) {
            formattedDataTeam.push({
                team: score.team ? score.team.name : 'Unassigned',
                id: score.teamId,
                school: score.student.school.name,
            });
            teamIndex = formattedDataTeam.length-1;
        }
        if (index >= 0) {
        } else {
            formattedDataStudent.push({
                id: score.studentId,
                first: score.student.first,
                school: score.student.school.name,
                team: score.team ? score.team.name : '',
                last: score.student.last,
            });
            index = formattedDataStudent.length-1;
            formattedDataTeam[teamIndex]['participants'] = (formattedDataTeam[teamIndex]['participants'] || 0) +1;
        }
        formattedDataStudent[index][''+score.question.questionNum] = 
            score.pointsAwarded;
        formattedDataStudent[index]['total'] = (formattedDataStudent[index]['total'] || 0)+score.pointsAwarded;

        formattedDataTeam[teamIndex][''+score.question.questionNum] = (formattedDataTeam[teamIndex][''+score.question.questionNum] || 0) + score.pointsAwarded;
        formattedDataTeam[teamIndex]['total'] = (formattedDataTeam[teamIndex]['total'] || 0)+score.pointsAwarded;
    });
    return {student:formattedDataStudent, team: formattedDataTeam};
}

const ContestScoreView = ({id} : any) => {
    const [useTeam, setUserTeam] = React.useState(true); 
    const {enqueueSnackbar} = useSnackbar();
    const { data, refetch, loading, error } = useQuery(CONTEST_BY_ID, {variables: {contestId: id}
    });
    if (loading)
        return (<div> loading...</div>);
    if (error || !data.contest)
        return (<div> error... </div>);
    return ( 
        <Typography component={'span'}>
            <br/><br/>
                <MaterialTable
                    title={`${data.contest.name} (${useTeam ? 'Team' : 'Student'})`}
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
                            [...Array(data.contest.questionCount)].map(
                                (x,i) : any => {
                                    return {title: ""+(i+1), field: ""+(i+1), type: useTeam ? 'numeric' : 'boolean'};
                                }
                            )
                        ),
                        {title: 'Total', field: 'total', type: 'numeric'},
                        ...(useTeam ? [{title: 'Participants', field: 'participants', type: 'numeric'}] : []),
                    ]}
                    data={useTeam ? formatData(data.contest).team : formatData(data.contest).student}
                                    />
        </Typography>
    );
};



export default ContestScoreView;
