import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export class HeaderDrawerObj extends React.Component {
    render() {
        return (
            <div>
            </div>
        )
    }


}
export default function HeaderDrawer() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

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

    return (
        <SwipeableDrawer
            className={classes.list}
            anchor="left"
            open={open}
            onClose={handleDrawerOpen()}
            onOpen={handleDrawerClose()}
        >
        </SwipeableDrawer>
    );
}
