import React, {useContext} from 'react';
import {Redirect} from 'react-router-dom';
import { Home, Notifications, AccountCircle } from '@material-ui/icons';
import Register from './components/Register/Register';
import SchoolManager from './components/School/SchoolManager';

import Login from './components/Login/Login';

import {isLoggedIn} from './Auth';
import AdminPanel from './components/Admin/AdminPanel';
import ScoreManager from './components/Score/ScoreManager';
import HomePage from './components/ScoreViewer/HomePage';

const Routes = [

    {
        path: '/',
        exact: true,
        sidebarName: 'Home',
        navbarName: 'Home',
        icon: Home,
        isAccessable: () => true,
        component: () => (<Redirect to="/scores/view" />),
    },
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
        isAccessable: () => !isLoggedIn(),
        component: Register 
    },
    {
        path: '/scores/view',
        exact: true,
        sidebarName: 'View Scores',
        navbarName: 'View Scores',
        icon: Home,
        isAccessable: () => true,
        component: HomePage,
    },
    {
        path:'/manage',
        sidebarName: 'Manage School',
        navbarName: 'Manage School',
        icon: AccountCircle,
        isAccessable: isLoggedIn,
        component: SchoolManager 
    },
    {
        path: '/scores/add',
        sidebarName: 'Add Scores',
        navbarName: 'Add Scores',
        icon: AccountCircle,
        isAccessable: isLoggedIn,
        component: ScoreManager,
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
