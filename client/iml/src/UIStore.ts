import { createContext } from 'react';
import {autorun, decorate, observable, computed} from 'mobx';
import {isLoggedIn} from './Auth';


function autosave(store: UIStoreClass, save : any) {
    // do not autorun on creation-related changes
    let firstRun = false;
    autorun(() => {
    });
}
export class UIStoreClass {
    drawerToggled = false;
    darkTheme = false;
    isLoggedIn = false;

    constructor() {
        this.load();
    };

    load() {
        this.isLoggedIn = isLoggedIn();
        this.darkTheme = localStorage.getItem('darkTheme') === '1';
    };

    toggleDrawer = () => {
        this.drawerToggled = !(this.drawerToggled);
    };

    setDrawer = (status : boolean) => {
        this.drawerToggled = status;
    };

    setDarkTheme = (status : boolean ) => {
        this.darkTheme = status;
    };
}

decorate(UIStoreClass, {
    drawerToggled: observable,
    darkTheme: observable
});

export const UIStoreObject = new UIStoreClass();

export default createContext(UIStoreObject);

