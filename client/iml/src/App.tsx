import React from 'react';
import NavHeader from './components/Header/HeaderNav/HeaderNav';
import HeaderDrawer from './components/Header/HeaderDrawer/HeaderDrawer';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { setContext } from 'apollo-link-context';


const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

const authLink = setContext( 
    (_ : any, { headers } : any) => {
    const token = localStorage.getItem('authToken');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
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

class App extends React.Component {
    public render() {
        return (
            <ApolloProvider client={client}>
                <MuiThemeProvider theme={null}>
                    <Navbar />
                </MuiThemeProvider>
            </ApolloProvider>
        );
    }
}

export default App;
