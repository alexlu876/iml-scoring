import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MaterialTable, {MaterialTableProps} from 'material-table';
import {useSnackbar} from 'notistack';

import {CONTEST_BY_ID} from '../../queries/score';

import {deglobifyId} from '../../utils/serializers';

const ContestScoreView = ({id} : any) => {
    const {enqueueSnackbar} = useSnackbar();
    const { data, refetch, loading, error } = useQuery(CONTEST_BY_ID, {variables: {contestId: id}
    });
    if (loading)
        return (<div> loading...</div>);
    if (error || !data.contest)
        return (<div> error... </div>);
    const formatData = (data : any) : any[] => {
        const formattedData = [] as any[];
        data.scores.edges.forEach((edge : any) => {
            const score = edge.node;
            let index=formattedData.findIndex(
                (entry: any) =>
                entry.id==score.studentId
            );
            if (index >= 0) {
            } else {
                formattedData.push({
                        id: score.studentId,
                        first: score.student.first,
                        school: score.student.school.name,
                        team: score.team ? score.team.name : '',
                        last: score.student.last,
                });
                index = formattedData.length-1;
            }
            formattedData[index][''+score.question.questionNum] = 
                score.pointsAwarded;
            formattedData[index]['total'] = (formattedData[index]['total'] || 0)+score.pointsAwarded;
        });
        return formattedData;
    }
    return ( 
        <Typography component={'span'}>
            <br/><br/>
                <MaterialTable
                    title={data.contest.name}
                    options={{
                        // selection: true,
                        pageSize: 10,
                        pageSizeOptions: [5,10,25,50,100,150],
                        exportButton: true

                    }}
                    columns={[
                        {title: 'First Name', field: 'first'},
                        {title: 'Last Name', field: 'last'},
                        ...(
                            [...Array(data.contest.questionCount)].map(
                                (x,i) : any => {
                                    return {title: ""+(i+1), field: ""+(i+1), type: 'boolean'};
                                }
                            )
                        ),
                        {title: 'Total', field: 'total'},
                        {title: 'School', field: 'school'},
                        {title: 'Team', field: 'team'},
                    ]}
                    data={formatData(data.contest)}
                                    />
                                            </Typography>
    );
};



export default ContestScoreView;
