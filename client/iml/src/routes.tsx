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
import ForgotPassword from './components/Login/ForgotPassword';
import PasswordReset from './components/Login/PasswordReset';

const Routes = [

    {
        path: '/',
        exact: true,
        sidebarName: 'Home',
        navbarName: 'Home',
        icon: Home,
        isAccessable: () => true,
        isAccessableStrict: (is_admin: boolean ) => true,
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
        path: '/forgot_password',
        isAccessable: () => !isLoggedIn(),
        component: ForgotPassword,
    },
    {
        path: '/reset_password',
        isAccessable: () => !isLoggedIn(),
        component: PasswordReset,
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
        exact: false,
        sidebarName: 'View Scores',
        navbarName: 'View Scores',
        icon: Home,
        isAccessable: () => true,
        isAccessableStrict: (is_admin: boolean ) => true,
        component: HomePage,
    },
    {
        path:'/manage',
        sidebarName: 'Manage School',
        navbarName: 'Manage School',
        icon: AccountCircle,
        isAccessable: isLoggedIn,
        isAccessableStrict: (is_admin: boolean ) => !is_admin,
        component: SchoolManager 
    },
    {
        path: '/scores/add',
        sidebarName: 'Add Scores',
        navbarName: 'Add Scores',
        icon: AccountCircle,
        isAccessable: isLoggedIn,
        isAccessableStrict: (is_admin: boolean ) => isLoggedIn() && !is_admin,
        component: ScoreManager,
    },
    {
        path: '/admin',
        sidebarName: 'Admin Panel',
        navbarName: 'Admin Panel',
        icon: AccountCircle,
        isAccessable: isLoggedIn,
        isAccessableStrict: (is_admin: boolean ) => isLoggedIn() && is_admin,
        component: AdminPanel
    }
];

export default Routes;
