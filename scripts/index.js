import { LitElement, html } from 'lit';
import { CountDown } from './countdown/countdown';
import { Mobile } from './mobile/mobile';
import { prepareData } from './preparation/prepare-data.mjs';
import { firebaseApp } from './firebase/config.mjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

class Main extends LitElement {
    constructor() {
        super();
        this.continents = undefined;
        prepareData().then((continents) => {
            console.log(continents);
            this.continents = continents;
            this.requestUpdate();
        });
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('userLogged');
            } else {
                console.log('userNotLogged');
            }
            //https://firebase.google.com/docs/auth/web/start
            //https://firebase.google.com/docs/firestore/quickstart
            //https://firebase.google.com/docs/auth/web/firebaseui
        });
    }

    /**
     *
     * @returns true if media queries detection as a width less than 600px
     */
    isMobile() {
        return !window.matchMedia('(min-width: 600px)').matches;
    }

    render() {
        return html`${this.continents
            ? html`${this.isMobile()
                  ? html`<count-down-mobile
                        .continents=${this.continents}></count-down-mobile>`
                  : html`<count-down
                        .continents=${this.continents}></count-down>`}`
            : html`loading...`}`;
    }
}
customElements.define('count-down-main', Main);
