import React, {useContext} from 'react';

import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { setContext } from 'apollo-link-context';

import NavHeader from './components/Header/HeaderNav/HeaderNav';
import HeaderDrawer from './components/Header/HeaderDrawer/HeaderDrawer';
import outerTheme from './themes/Theme';
import MainStore from './MainStore';
import {observer} from 'mobx-react';



const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

const authLink = setContext( 
    (_ : any, { headers } : any) => {
    const token = localStorage.getItem('authToken');
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ""
         },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
            <MuiThemeProvider theme={outerTheme}>
                <div>
                    <NavHeader toggleDrawer = {store.toggleDrawer} />
                    <HeaderDrawer open= {store.drawerToggled}
                    setOpen = {store.setDrawer}/>
                </div>
        </MuiThemeProvider>
    </ApolloProvider>
    );
});
export default App;
