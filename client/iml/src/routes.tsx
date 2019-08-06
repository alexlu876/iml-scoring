import React, {useContext} from 'react';
import { Home, Notifications, AccountCircle } from '@material-ui/icons';
import Dc from './components/SmallComponents/Dc';
import View from './components/SmallComponents/View'
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
    sidebarName: 'owodc',
    navbarName: 'dc',
    icon: Home,
    component: Dc },
  {
    path: '/signup',
    sidebarName: 'register',
    navbarName: 'register',
    icon: AccountCircle,
    component: Register },
  {
    path: '/view',
    sidebarName: 'view data lmao',
    navbarName: 'bruh.',
    icon: AccountCircle,
    component: View },
];

export default Routes;
