import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable, {MaterialTableProps} from 'material-table';
import {useSnackbar} from 'notistack';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import {CONTEST_BY_ID, DIVISION_SCORES_BY_ID} from '../../queries/score';

import {deglobifyId} from '../../utils/serializers';
import { ResponsiveStream } from '@nivo/stream';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            margin: (theme.spacing(4),theme.spacing(4), theme.spacing(10), theme.spacing(4)),
            align: 'center',
            alignItems: 'center',
            height: 400,
        },
    }),
);

const DELIM = '?';

export const formatData = (division: any) : any => {
    const formattedDataStudent = [] as any[];
    const formattedDataTeam = [] as any[];
    const formattedDataSum = [{}, {}, {}, {}, {}, {}] as any[];
    division.contests.edges.forEach((contestEdge : any) => {
        const contestId = deglobifyId(contestEdge.node.id);
        const contestNameAndId = `${contestEdge.node.name}`
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
            formattedDataSum[score.question.questionNum-1][contestNameAndId] = (formattedDataSum[score.question.questionNum-1][contestNameAndId] || 0) + score.pointsAwarded;
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
    return {team: filteredDataTeam, student: filteredDataStudent, sum: formattedDataSum}
}
const DivisionScoreView = ({id} : any) => {
    const classes= useStyles();
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
                                        title: ""+(!edge.node.name.match(/Contest(\s)+[0-9]+/) ? edge.node.name :  (()=>{let nameAsList=edge.node.name.trim().split(/(\s)+/); return nameAsList[nameAsList.length-1]})()),
                                        field: ""+(deglobifyId(edge.node.id)),
                                        type: 'numeric'};
                                }
                            )
                        ),
                        {title: 'Total', field: 'total', type: 'numeric'},
                    ]}
                    data={useTeam ? formatData(data.division).team : formatData(data.division).student}
                                    />

            {
                data && data.division.contests.edges.length && formatData(data.division).sum[0] && Object.keys(formatData(data.division).sum[0]).length > 0 && (
            <Container className={classes.container}>
			<ResponsiveStream
				data={formatData(data.division).sum}
                keys={Object.keys(formatData(data.division).sum[0]) }
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					orient: 'bottom',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Question',
					legendOffset: 36,
                    format: v => v as number +1,
				}}
				axisLeft={{ orient: 'left', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Score Across All Students', legendOffset: -40 }}
				offsetType="silhouette"
				colors={{ scheme: 'nivo' }}
				fillOpacity={0.85}
				borderColor={{ theme: 'background' }}
				defs={[
					{
						id: 'dots',
						type: 'patternDots',
						background: 'inherit',
						color: '#2c998f',
						size: 4,
						padding: 2,
						stagger: true
					},
					{
						id: 'squares',
						type: 'patternSquares',
						background: 'inherit',
						color: '#e4c912',
						size: 6,
						padding: 2,
						stagger: true
					}
				]}
				fill={[
				]}
				dotSize={8}
				dotColor={{ from: 'color' }}
				dotBorderWidth={2}
				dotBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.7 ] ] }}
				animate={true}
				motionStiffness={90}
				motionDamping={15}
				legends={[
					{
						anchor: 'bottom-right',
						direction: 'column',
						translateX: 120,
						itemWidth: 120,
						itemHeight: 20,
						itemTextColor: '#999999',
						symbolSize: 12,
						symbolShape: 'circle',
						effects: [
							{
								on: 'hover',
								style: {
									itemTextColor: '#000000'
								}
							}
						]
					}
				]}
            />
            </Container>
                )
            }


        </Typography>
   );
};

export default DivisionScoreView;
