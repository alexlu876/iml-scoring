import React, {useContext} from 'react';
import {Redirect} from 'react-router-dom';
import { Home, Notifications, AccountCircle } from '@material-ui/icons';
import Register from './components/Register/Register';

import Login from './components/Login/Login';

import {isLoggedIn} from './Auth';
import AdminPanel from './components/Admin/AdminPanel';

const Routes = [

    {
        path: '/',
        sidebarName: 'Home',
        navbarName: 'Home',
        icon: Home,
        isAccessable: () => true,
        component: () => <div> bruh </div>,},
    {
        path: '/login',
        sidebarName: 'Login',
        navbarName: 'login',
        icon: AccountCircle,
        isAccessable: () => !isLoggedIn(),
        component: Login
    },
    {
        path: '/signup',
        sidebarName: 'Register',
        navbarName: 'Register',
        icon: AccountCircle,
        isAccessable: () => false,
        component: Register 
    },
    {
        path: '/admin',
        sidebarName: 'Admin Panel',
        navbarName: 'Admin Panel',
        icon: AccountCircle,
        isAccessable: isLoggedIn,
        component: AdminPanel
    }
];

export default Routes;
