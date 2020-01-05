import React, {useContext} from 'react';
import { Home, Notifications, AccountCircle } from '@material-ui/icons';
import Register from './components/Register/Register';

import Login from './components/Login/Login';

import AdminPanel from './components/Admin/AdminPanel';

const Routes = [

    {
        path: '/',
        sidebarName: 'Home',
        navbarName: 'Home',
        icon: Home,
        component: () => <div> bruh </div>,},
    {
        path: '/login',
        sidebarName: 'Login',
        navbarName: 'login',
        icon: AccountCircle,
        component: Login 
    },
    {
        path: '/signup',
        sidebarName: 'Register',
        navbarName: 'Register',
        icon: AccountCircle,
        component: Register 
    },
    {
        path: '/admin',
        sidebarName: 'Admin Panel',
        navbarName: 'Admin Panel',
        icon: AccountCircle,
        component: AdminPanel
    }
];

export default Routes;
