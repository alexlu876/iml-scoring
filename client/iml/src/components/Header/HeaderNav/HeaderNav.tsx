import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import gql from 'graphql-tag';
import { Query } from 'react-apollo'

const PROFILE_QUERY = gql`
query CurrentUserForLayout {
    viewer {
        first
        last
    }
}
`;

const useStyles = makeStyles(
    (theme: Theme) => 
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),

        },
        title: {
            flexGrow: 1,
        }
    })
);

export default function HeaderNav({toggleDrawer} : any) {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAuth(event.target.checked);
    }
    function handleMenu(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }
    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div className={classes.root}>
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={auth} onChange={handleChange} aria-label="LoginSwitch" />}
                        label={auth ? 'Logout' : 'Login'}
                    />
            </FormGroup>

            <AppBar>
                <Toolbar>
                    <IconButton edge="start"
                        className = {classes.menuButton}
                        onClick = {toggleDrawer}
                        color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Query query={PROFILE_QUERY}>
                                { ({loading,
                                    error,
                                    data} : any) => {
                                        if (loading) return 'Loading...';
                                        if (error) console.log(error);
                                        if (error) return 'Error';
                                        console.log(data)
                                        const userData = data.viewer;
                                        if (userData)
                                        return userData.first;
                                        return 'Error';
                                }}
                        </Query>
                    </Typography>
                        {auth && (
                            <div>
                                <IconButton
                                    aria-label="Account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                        horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                        horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            </Menu>
                        </div>
                        )}


        </Toolbar>
    </AppBar>
</div>
    )



}