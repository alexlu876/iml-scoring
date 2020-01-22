import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Switch from '@material-ui/core/Switch';
import {List, ListItemIcon, ListItemText, Divider, IconButton, MenuList, MenuItem, Drawer } from '@material-ui/core';
import Routes from '../../../routes';
import {BrowserRouter as Router, Route, Redirect, Link, Switch as RouteSwitch} from 'react-router-dom';

import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'

import {VIEWER_QUERY} from '../../../queries/user';
import {client} from '../../../App';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function HeaderDrawer({darkTheme, setDarkTheme, open, setOpen} : any) {
    const classes = useStyles();
    const {data, loading, error} = useQuery(VIEWER_QUERY, {client: client});

    function handleDrawerOpen() {
        return (event: React.KeyboardEvent | React.MouseEvent) => {
            setOpen(true);
        }
    }
    function handleDrawerClose(){
        return (event: React.KeyboardEvent | React.MouseEvent) => {
            setOpen(false);
        }
    }
    const handleThemeChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkTheme(event.target.checked)
    }

    return (
        <SwipeableDrawer
            className={classes.list}
            anchor="left"
            open={open}
            onClose={handleDrawerClose()}
            onOpen={handleDrawerOpen()}
        >
        <div
            onClick={handleDrawerClose()}
            role="presentation"
            className={classes.list} >
                <br/>
                <Typography variant="h5" align='center'>
                    {data && data.viewer && `${data.viewer.first} ${data.viewer.last} `}
                </Typography>
                <br/>
                <Typography variant="h6" align='center'>
                    {data && data.viewer && data.viewer.school && `${data.viewer.school.name}` }
                </Typography>
                {data && data.viewer && data.viewer.school && (<br/>)}
                <Divider />
                <MenuList>
                {Routes.map((prop, key) => {
                  return (prop.isAccessable ? prop.isAccessable() : true) && (
                      <MenuItem component={Link} to={prop.path} key={key}>
                        <ListItemIcon>
                            <prop.icon />
                        </ListItemIcon>
                        <ListItemText primary={prop.sidebarName} />
                      </MenuItem>
                  )})}
              </MenuList>
            <Divider />
            <FormControlLabel
                control={
                <Switch
                    checked={darkTheme}
                    onChange={handleThemeChange('useDarkTheme')}
                    value='useDarkTheme'
                    inputProps={{ 'aria-label': 'use dark theme' }}
                />
                        }
                    label="Dark Theme"
                />
        </div>
        </SwipeableDrawer>
    );
}
