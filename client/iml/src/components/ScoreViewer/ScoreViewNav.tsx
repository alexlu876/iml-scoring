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
import { DIVISIONS_QUERY } from '../../queries/division';
import { deglobifyId } from '../../utils/serializers';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
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

interface ListItemLinkProps extends LinkProps {
      to: string;
      open?: boolean;
      primary: string;
}

interface ListItemState {
    to: string;
    open?: boolean;
}

function ListItemLink(props: Omit<ListItemLinkProps, 'ref'>) {
    const { to, open, primary, ...other } = props;
    return (
        <li>
            <ListItem button component={RouterLink} to={to} {...other}>
                <ListItemText primary={primary} />
                {open != null ? open ? <ExpandLess /> : <ExpandMore /> : null}
            </ListItem>
        </li>
    );
}



const ScoreViewNav = () => {
    const classes = useStyles();
    const divisionsQuery = useQuery(DIVISIONS_QUERY);
    const {data, loading, error} = divisionsQuery;
    const [open, setOpen] = React.useState<ListItemState[]>([]);

    const handleClick = (originalTo: string ) => {
        const index = open.findIndex((prop) => prop.to==originalTo);
        if (index >= 0) {
            const isDivisionOpen = open[index].open;
            setOpen([...open.slice(0,index), {open: !isDivisionOpen, to: originalTo}, ...open.slice(index+1, open.length)]); 
        }
        //the first time its clicked, it will always be to open.
        else {
            setOpen([...open, {to: originalTo, open: true}]);
        }
    };

    return (
	<Switch>
      <div className={classes.root}>
        <Route>
          {({ location }) => {
            const pathnames = location.pathname.split('/').filter(x => x).slice(2);
            return (
              <Breadcrumbs aria-label="breadcrumb">
                <LinkRouter color="inherit" to="/">
                  Home
                </LinkRouter>
                  {pathnames.map((value, index) => {
                      const last = index === pathnames.length - 1;
                      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                      if (!data || !data.divisions.edges)
                          return null;
                      const division = data.divisions.edges.find(
                          (edge : any) => edge.node.url==pathnames[0]
                      );
                      if (!division)
                          return null;
                      const contest = division.node.contests.edges.find(
                          (edge : any) => deglobifyId(edge.node.id)==parseInt(pathnames[1])
                      );
                      const toDisplay = index===0 ? division.node.name : (index===1 ? contest && contest.node.name : null);
                  return last ? (
                    <Typography color="textPrimary" key={to+"text"}>
                        {toDisplay}
                    </Typography>
                  ) : (
                    <LinkRouter color="inherit" to={"/scores/view"+to} key={to}>
                      {toDisplay}
                    </LinkRouter>
                  );
                })}
              </Breadcrumbs>
            );
          }}
        </Route>
        <nav className={classes.lists} aria-label="scores-navigation">
          <List>
              {data && data.divisions.edges.map(
                  (edge : any) => {
                      const to = `/scores/view/${edge.node.url}`;
                      const primary = edge.node.name;
                      const checkOpen = (originalTo: string) => {
                          const prop = open.find((prop) => prop.to==originalTo);
                          //explitly return boolean values
                          return (prop && prop.open) ? true: false;
                      }
                      return (
                          <React.Fragment>
                              <ListItemLink key={to} to={to} primary={primary} open={checkOpen(to)} onClick={() => handleClick(to)} />
                              <Collapse key={`collapse-${to}`}component="li" in={checkOpen(to)} timeout="auto" unmountOnExit>
                                  <List disablePadding>
                                      {edge.node.contests.edges.map((contestEdge: any) => {
                                          const toContest = `${to}/${(deglobifyId(contestEdge.node.id) || "")}`;
                                          const primary = contestEdge.node.name;
                                          return (
                                              <ListItemLink key={toContest} to={toContest} primary={primary} className={classes.nested} />
                                          )
                                      })}
                                  </List>
                              </Collapse>
                          </React.Fragment>
                      )
                  }
              )}
          </List>
        </nav>
      </div>
    </Switch>
  );
}


export default ScoreViewNav;
