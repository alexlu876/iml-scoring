import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Login from './components/Login/Login';
import {Component} from 'react';
import {isLoggedIn} from './Auth';

export const PrivateRoute = ({authorize, component : Component, ...rest}: any) => {
    var authFunction = authorize || isLoggedIn;
    return (
        <Route {...rest} 
            render= {
                (props) => (
                authFunction() ? (<Component {...props}/> ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: {from : props.location}
                    }}
                    />
                )
                )
            }
        />
        );
}
