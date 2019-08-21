import React, {useContext} from 'react';

import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

import {ApolloLink} from 'apollo-link';
import {onError} from 'apollo-link-error';
import {createHttpLink} from 'apollo-link-http';
import {TokenRefreshLink} from 'apollo-link-token-refresh';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { setContext } from 'apollo-link-context';

import NavHeader from './components/Header/HeaderNav/HeaderNav';
import HeaderDrawer from './components/Header/HeaderDrawer/HeaderDrawer';
import Register from './components/Register/Register'
import outerTheme from './themes/Theme';
import MainStore from './MainStore';
import {observer} from 'mobx-react';
import {getLocalAccessToken, getLocalRefreshToken, isTokenValid, setLocalAccessToken, setLocalTokenFreshness, isLoggedIn} from './Auth';

import Routes from './routes'

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

const refreshLink = new TokenRefreshLink(
    {
        accessTokenField: 'accessToken',
        isTokenValidOrUndefined: () => {
            var authToken = getLocalAccessToken();
            console.log(authToken);
            if (!authToken) return true;
            return isTokenValid(authToken);
        },
        fetchAccessToken: (args: any[]) => {
            console.log("BRUH2");
            var token = getLocalRefreshToken();
            return fetch('http://localhost:5000/jwt_refresh', {
                method: 'GET',
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            })
        },
        handleFetch: (token : string ) => {
            setLocalAccessToken(token);
            setLocalTokenFreshness(false);
        },
    }
);

const authLink = setContext(
    (_ : any, { headers } : any) => {
    const token = localStorage.getItem('accessToken');
        if (isLoggedIn())
        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : ""
            },
        };
        return headers;
    });
const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log('graphQLErrors', graphQLErrors)
  console.log('networkError', networkError)
})

const link = ApolloLink.from([
    refreshLink,
    authLink,
    httpLink,
    errorLink
]);
export const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

const Navbar = () => {
    return(
        <div>
            <NavHeader />
            <HeaderDrawer />
        </div>
    );
}


const App = observer(() => {
    const store = useContext(MainStore);
    return (
        <ApolloProvider client={client}>
          <head><link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/></head>
          <Router>
                <MuiThemeProvider theme={outerTheme}>
                    <NavHeader toggleDrawer = {store.toggleDrawer} />
                    <HeaderDrawer open= {store.drawerToggled}
                    setOpen = {store.setDrawer}/>
                </MuiThemeProvider>
            {Routes.map((prop, key) => <Route exact path={prop.path} key={key} component={prop.component} /> )}
        </Router>
      </ApolloProvider>
    );
});
export default App;
