import { createContext } from 'react';
import {autorun, decorate, observable, computed} from 'mobx';
import {isLoggedIn} from './Auth';


function autosave(store: MainStoreObject, save : any) {
    autorun(() => {
    });
}
export class MainStoreObject {
    drawerToggled = false;
    darkTheme = false;
    isLoggedIn = false;

    constructor() {
        this.load();
    };

    load() {
        this.isLoggedIn = isLoggedIn();
    };

    toggleDrawer = () => {
        this.drawerToggled = !(this.drawerToggled);
        console.log("toggled!")
    };

    setDrawer = (status : boolean) => {
        this.drawerToggled = status;
    };

    setDarkTheme = (status : boolean ) => {
        this.darkTheme = status;
    };
}

decorate(MainStoreObject, {
    drawerToggled: observable,
    darkTheme: observable
});


export default createContext(new MainStoreObject())
