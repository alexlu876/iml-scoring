import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Switch from '@material-ui/core/Switch';
import {List, ListItemIcon, ListItemText, Divider, IconButton, MenuList, MenuItem, Drawer } from '@material-ui/core';
import Routes from '../../../routes';
import {BrowserRouter as Router, Route, Redirect, Link, Switch as RouteSwitch} from 'react-router-dom';

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
            <Switch
                checked={darkTheme}
                onChange={handleThemeChange('useDarkTheme')}
                value='useDarkTheme'
                inputProps={{ 'aria-label': 'use dark theme' }}
            />

        </div>
        </SwipeableDrawer>
    );
}
