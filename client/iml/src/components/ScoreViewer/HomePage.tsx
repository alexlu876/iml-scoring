import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import CardTitle from '../../components/CardTitle';
import { useQuery} from '@apollo/react-hooks'
/* eslint-disable no-nested-ternary */
import List from '@material-ui/core/List';
import Link, { LinkProps } from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Route, MemoryRouter } from 'react-router';
import { Switch, BrowserRouter, Link as RouterLink } from 'react-router-dom';
import { Omit } from '@material-ui/types';

interface ListItemLinkProps extends LinkProps {
      to: string;
      open?: boolean;
}

const breadcrumbNameMap: { [key: string]: string } = {
      '/inbox': 'Inbox',
      '/inbox/important': 'Important',
      '/trash': 'Trash',
      '/spam': 'Spam',
      '/drafts': 'Drafts',
};

function ListItemLink(props: Omit<ListItemLinkProps, 'ref'>) {
    const { to, open, ...other } = props;
    const primary = breadcrumbNameMap[to];

    return (
        <li>
            <ListItem button component={RouterLink} to={to} {...other}>
                <ListItemText primary={primary} />
                    {open != null ? (open ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItem>
        </li>
            );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: 360,
        },
        lists: {
            backgroundColor: theme.palette.background.paper,
            marginTop: theme.spacing(1),
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

interface LinkRouterProps extends LinkProps {
    to: string;
    replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any} />;




const HomePage = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(prevOpen => !prevOpen);
    };

    return (
	<Switch>
      <div className={classes.root}>
        <Route>
          {({ location }) => {
            const pathnames = location.pathname.split('/').filter(x => x);

            return (
              <Breadcrumbs aria-label="breadcrumb">
                <LinkRouter color="inherit" to="/">
                  Home
                </LinkRouter>
                {pathnames.map((value, index) => {
                  const last = index === pathnames.length - 1;
                  const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                  return last ? (
                    <Typography color="textPrimary" key={to}>
                      {breadcrumbNameMap[to]}
                    </Typography>
                  ) : (
                    <LinkRouter color="inherit" to={to} key={to}>
                      {breadcrumbNameMap[to]}
                    </LinkRouter>
                  );
                })}
              </Breadcrumbs>
            );
          }}
        </Route>
        <nav className={classes.lists} aria-label="mailbox folders">
          <List>
            <ListItemLink to="/inbox" open={open} onClick={handleClick} />
            <Collapse component="li" in={open} timeout="auto" unmountOnExit>
              <List disablePadding>
                <ListItemLink to="/inbox/important" className={classes.nested} />
              </List>
            </Collapse>
            <ListItemLink to="/trash" />
            <ListItemLink to="/spam" />
          </List>
        </nav>
      </div>
    </Switch>
  );
}


export default HomePage;
