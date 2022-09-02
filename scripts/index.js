import { LitElement, html, css } from 'lit';
import { CountDown } from './countdown/countdown';
import { Mobile } from './mobile/mobile';
import { prepareData } from './preparation/prepare-data.mjs';
import { firebaseApp } from './firebase/config.mjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GlobalService } from './services/global-service.mjs';
class Main extends LitElement {
    constructor() {
        super();
        this.continents = undefined;
        this.service = new GlobalService();
        this.logged = undefined;
        this.admin = false;
        prepareData().then((continents) => {
            this.continents = continents;
            this.requestUpdate();
        });

        this.service
            .checkLogin()
            .then((user) => {
                this.logged = user;
                this.admin = user.admin;
                console.log('userLogged', this.logged);
                this.requestUpdate();
            })
            .catch(() => {
                this.service.login();
                console.log('userNotLogged');
            });
    }

    static styles = css`
        :host {
            position: absolute;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            top: 0;
            left: 0;
            background: linear-gradient(
                var(--tertiary-dark) 0,
                var(--tertiary) 30%,
                var(--tertiary) 70%,
                var(--tertiary-dark) 100%
            );
        }
    `;

    /**
     *
     * @returns true if media queries detection as a width less than 600px
     */
    isMobile() {
        return !window.matchMedia('(min-width: 600px)').matches;
    }

    renderGame() {
        return html` ${this.isMobile() || !this.admin
            ? html`<count-down-mobile
                  .continents=${this.continents}
                  .service=${this.service}></count-down-mobile>`
            : html`<count-down
                  .continents=${this.continents}
                  .service=${this.service}></count-down>`}`;
    }

    render() {
        return html`${this.continents
            ? html`${this.logged ? this.renderGame() : html`login...`}`
            : html`loading...`}`;
    }
}
customElements.define('count-down-main', Main);
