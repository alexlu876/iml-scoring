import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import {List, ListItemIcon, ListItemText, Divider, IconButton, MenuList, MenuItem, Drawer } from '@material-ui/core';
import Routes from '../../../routes';
import {BrowserRouter as Router, Route, Redirect, Link, Switch as RouteSwitch} from 'react-router-dom';

import { useQuery, useMutation, useApolloClient} from '@apollo/react-hooks'

import {VIEWER_QUERY} from '../../../queries/user';
import UIStore from '../../../UIStore';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  heading: {
      minHeight: 100,
  }
});

export default function HeaderDrawer({darkTheme, setDarkTheme, open, setOpen} : any) {
    const classes = useStyles();
    const {data, loading, error} = useQuery(VIEWER_QUERY);

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
            ModalProps={{ keepMounted: true }}
        >
        <div
            onClick={handleDrawerClose()}
            role="presentation"
            className={classes.list} >
            <div className={classes.heading}>
                <br />
                <Typography variant="h5" align='center'>
                    {loading ? 'Loading...' : (data && data.viewer && `${data.viewer.first} ${data.viewer.last} `) || 'Guest'}
                </Typography>
                <Typography variant="h6" align='center'>
                    {data && data.viewer && data.viewer.school && `${data.viewer.school.name}` }
                </Typography>
                {data && data.viewer && data.viewer.school && (<br/>)}
            </div>
                <Divider />
                <MenuList>
                {Routes.map((prop, key) => {
                    return (prop.isAccessable ? prop.isAccessable() : true) && ((data && data.viewer) ? (prop.isAccessableStrict ? prop.isAccessableStrict(data.viewer.isAdmin): true)  : (prop.isAccessableStrict ? prop.isAccessableStrict(false) : true)) &&(
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
