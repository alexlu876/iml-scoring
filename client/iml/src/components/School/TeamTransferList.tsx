import React from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';
import {useSnackbar} from 'notistack';

import {
    TEAM_CURRENT_STUDENTS_QUERY,
    NO_TEAM_STUDENTS_QUERY,
    SET_TEAM_MEMBERS
} from '../../queries/team'; 
import {deglobifyId} from '../../utils/serializers';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 'auto',
        },
        paper: {
            width: 200,
            height: 230,
            overflow: 'auto',
        },
        button: {
            margin: theme.spacing(0.5, 0),
        },
    }),
);

function not(a: number[], b: number[]) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a: number[], b: number[]) {
    return a.filter(value => b.indexOf(value) !== -1);
}


export default function TeamTransferList({divisionId, schoolId, teamId }:any) {
    
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [checked, setChecked] = React.useState<number[]>([]);
    const currentMembersQuery = useQuery(
        TEAM_CURRENT_STUDENTS_QUERY, {variables: {teamId: teamId}});
    const noTeamQuery = useQuery(
        NO_TEAM_STUDENTS_QUERY, {variables: {schoolId: schoolId, divisionId: divisionId}});
    const [setMembers, ] = useMutation(SET_TEAM_MEMBERS);

    if (!currentMembersQuery.data || !noTeamQuery.data)
        return (<div>loading...</div>)

    const leftIds = noTeamQuery.data.noTeamStudents.edges.map((edge:any) => deglobifyId(edge.node.id));
    const checkedLeft = intersection(checked, leftIds);

    const rightIds = currentMembersQuery.data.teamCurrentStudents.edges.map((edge:any) => deglobifyId(edge.node.id));

    const checkedRight = intersection(checked, rightIds) ;

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleCheckedRight = () => {
        // recall the mutation without checkedRight
        // elements
        setMembers({variables: {
            teamId: teamId,
            studentIds: rightIds.concat(checkedLeft),
        }}).then(
            res=> {
                noTeamQuery.refetch();
                currentMembersQuery.refetch();
                setChecked(not(checked,checkedLeft));
            },
            err=> {
                enqueueSnackbar(err.message.split(':')[1]);
            }
        );
    };

    const handleCheckedLeft = () => {
        console.log(leftIds.concat(checkedRight));
        // recall the mutation without checkedRight
        // elements
        setMembers({variables: {
            teamId: teamId,
            studentIds: not(rightIds, checkedRight),
        }}).then(
            res=> {
                noTeamQuery.refetch();
                currentMembersQuery.refetch();
                setChecked(not(checked,checkedRight));
            },
            err=> {
                enqueueSnackbar(err.message.split(':')[1]);
            }
        );
        
    };


    const customList = (items: any) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
          {items.map((item: any) => {
              const value = deglobifyId(item.id);
              const labelId = `transfer-list-item-${value}-label`;
              return (
                <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${item.username}`} />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      );

  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
        <Grid item>
            {customList(noTeamQuery.data.noTeamStudents.edges.map((edge: any) => edge.node))}
            <Typography align="center" variant="h6">
                Eligible Members
            </Typography>
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={checkedLeft.length===0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={checkedRight.length===0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
          <Grid item>
              {customList(currentMembersQuery.data.teamCurrentStudents.edges.map((edge: any) => edge.node))}
            <Typography align="center" variant="h6">
                Team Members
            </Typography>
      </Grid>
    </Grid>
  );

}
