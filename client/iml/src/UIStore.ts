import { createContext } from 'react';
import {autorun, decorate, observable, computed} from 'mobx';


function autosave(store: MainStoreObject, save : any) {
    autorun(() => {
    });
}
export class MainStoreObject {
    drawerToggled = false;
    darkTheme = false;

    constructor() {
        this.load();
    };

    load() {
        //load data into mobx 
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
