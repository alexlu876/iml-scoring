import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {client} from '../../App';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {
    VIEWER_SCHOOL_TEAMS_QUERY,
} from '../../queries/team'; 

import StudentsTable from '../../components/School/StudentsTable';
import TeamsTable from '../../components/School/TeamsTable';
import TeamTransferList from '../../components/School/TeamTransferList';

interface TabPanelProps {
      children?: React.ReactNode;
      index: any;
      value: any;
}

function TabPanel(props: TabPanelProps) {
      const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
                {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index: any) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function StudentsManager() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const {data, loading, error, refetch} = useQuery(VIEWER_SCHOOL_TEAMS_QUERY, {client: client});

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Students" {...a11yProps(0)} />
                    <Tab label="Teams Overview" {...a11yProps(1)} />
                        {data && data.viewerSchool && data.viewerSchool.teams.edges.map((edge: any, index: number) => (
                            <Tab label={edge.node.name} {...a11yProps(index+2)} />
                                )
                        )}
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <StudentsTable/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TeamsTable/>
            </TabPanel>
                        {data && data.viewerSchool && data.viewerSchool.teams.edges.map((edge: any, index: number) => (
                            <TabPanel value={value} index={index+2} >
                                <TeamTransferList teamId={edge.node.id} />
                            </TabPanel>
                                )
                        )}

        </div>
            )
};
