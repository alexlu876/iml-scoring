import React, {useContext} from 'react';
import { Home, Notifications, AccountCircle } from '@material-ui/icons';
import Dc from './components/Dc/Dc';
import Register from './components/Register/Register';

//^a template for other shit

const Routes = [
  {
    path: '/',
    sidebarName: 'home',
    navbarName: 'home',
    icon: Home,
    component: () => <div> bruh </div>,},
  {
    path: '/dc',
    sidebarName: 'bruh',
    navbarName: 'dc',
    icon: Home,
    component: Dc },
  {
    path: '/signup',
    sidebarName: 'register',
    navbarName: 'register',
    icon: AccountCircle,
    component: Register },
];

export default Routes;
