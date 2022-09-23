import { LitElement, html, css } from 'lit';
import { buttonCss } from './styles/shared-style.mjs';
import { CountDown } from './countdown/countdown';
import { Mobile } from './mobile/mobile';
import { prepareData } from './preparation/prepare-data.mjs';
import { firebaseApp } from './firebase/config.mjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GlobalService } from './services/global-service.mjs';

const GOOGLE_PROVIDER = 1;
const GITHUB_PROVIDER = 2;
class Main extends LitElement {
    constructor() {
        super();
        this.continents = undefined;
        this.service = new GlobalService();
        this.logged = undefined;
        this.admin = false;
        this.clickForSong = false;
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
                // this.service.login(
                //     this.renderRoot?.querySelector('#login-container')
                // );
                console.log('userNotLogged');
            });
    }

    static styles = [
        buttonCss,
        css`
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
                display: grid;
                grid-template-rows: 1fr;
                grid-template-columns: 200px;
                align-items: center;
                justify-content: center;
            }

            h1 {
                margin: 0;
                padding: 0;
                font-family: ‘Arial Narrow’, sans-serif;
                font-weight: 100;
                font-size: 1.1em;
            }

            span {
                position: relative;
                top: 0.63em;
                display: inline-block;
                text-transform: uppercase;
                opacity: 0;
                transform: rotateX(-90deg);
            }

            .let1 {
                animation: drop 1.2s ease-in-out infinite;
                animation-delay: 1.2s;
            }

            .let2 {
                animation: drop 1.2s ease-in-out infinite;
                animation-delay: 1.3s;
            }

            .let3 {
                animation: drop 1.2s ease-in-out infinite;
                animation-delay: 1.4s;
            }

            .let4 {
                animation: drop 1.2s ease-in-out infinite;
                animation-delay: 1.5s;
            }

            .let5 {
                animation: drop 1.2s ease-in-out infinite;
                animation-delay: 1.6s;
            }

            .let6 {
                animation: drop 1.2s ease-in-out infinite;
                animation-delay: 1.7s;
            }

            .let7 {
                animation: drop 1.2s ease-in-out infinite;
                animation-delay: 1.8s;
            }

            @keyframes drop {
                10% {
                    opacity: 0.5;
                }
                20% {
                    opacity: 1;
                    top: 3.78em;
                    transform: rotateX(-360deg);
                }
                80% {
                    opacity: 1;
                    top: 3.78em;
                    transform: rotateX(-360deg);
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    opacity: 0;
                    top: 6.94em;
                }
            }

            .login-container {
                display: flex;
                justify-content: space-evenly;
                align-content: center;
                align-items: center;
                flex-direction: column;
                width: 160px;
            }

            .login-container h1 {
                text-align: center;
                font-family: RumbleBrave;
                margin-bottom: 15px;
            }

            .login-btn {
                border: thin solid black;
                width: 160px;
                border-radius: 5px;
                margin-bottom: 10px;
                text-align: center;
                display: flex;
                justify-content: space-evenly;
                align-content: center;
                align-items: center;
                box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px,
                    rgb(0 0 0 / 14%) 0px 2px 2px 0px,
                    rgb(0 0 0 / 12%) 0px 1px 5px 0px;
            }

            .github-login {
                background-color: black;
                color: white;
            }

            .google-login {
                background-color: lightgray;
            }
        `,
    ];

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
            : this.clickForSong
            ? html`<count-down
                  .continents=${this.continents}
                  .service=${this.service}></count-down>`
            : html`<button @click="${() => this.click()}">
                  Start countdown
              </button>`}`;
    }

    render() {
        return html`${this.continents
            ? html`${this.logged
                  ? this.renderGame()
                  : html`<section class="login-container">
                        <h1>You should log yourself to play the game</h1>
                        <div
                            class="login-btn google-login"
                            @click="${() => this.login(GOOGLE_PROVIDER)}">
                            <?xml version="1.0" encoding="utf-8"?>
                            <!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                            <svg
                                fill="#000000"
                                width="32"
                                height="32"
                                version="1.1"
                                id="lni_lni-google"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 64 64"
                                style="enable-background:new 0 0 64 64;"
                                xml:space="preserve">
                                <path
                                    d="M61.5,29.2H32.8v8.5h20.6c-1.1,11.8-10.7,16.9-20,16.9c-11.8,0-22.3-9.2-22.3-22.5c0-12.8,10-22.5,22.3-22.5
	c9.4,0,15.1,6.1,15.1,6.1l5.8-6.1c0,0-7.8-8.5-21.3-8.5C15.2,1,1.6,15.9,1.6,32c0,15.6,12.8,31,31.7,31C50,63,62,51.7,62,34.8
	C62.1,31.3,61.5,29.2,61.5,29.2L61.5,29.2z" />
                            </svg>
                            Google Login
                        </div>
                        <div
                            class="login-btn github-login"
                            @click="${() => this.login(GITHUB_PROVIDER)}">
                            <?xml version="1.0" encoding="utf-8"?>
                            <!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                            <svg
                                fill="#ffffff"
                                width="32"
                                height="32"
                                version="1.1"
                                id="lni_lni-github"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 64 64"
                                style="enable-background:new 0 0 64 64;"
                                xml:space="preserve">
                                <path
                                    d="M63.7,31c-0.6-16.3-14-29.6-30.3-30.3C24.6,0.4,16.3,3.5,10,9.6c-6.3,6.1-9.8,14.2-9.8,22.9c0,14.4,9.7,27,23.5,30.7l0,0
	c0.3,0.1,0.7,0.1,1,0.1c0.8,0,1.6-0.3,2.3-0.8c0.9-0.7,1.5-1.8,1.5-3v-3.5c0-1,0.1-5.2,0.1-5.9c0.1-0.7,0.3-1.2,0.7-1.7
	c0.5-0.7,0.6-1.5,0.2-2.3c-0.3-0.7-1-1.1-1.8-1.2c-0.7-0.1-1.5-0.2-2-0.4c-0.8-0.2-1.7-0.6-2.6-1.1c-0.7-0.4-1.3-0.9-1.9-1.6
	c-0.5-0.6-0.9-1.5-1.3-2.7c-0.4-1.3-0.6-2.7-0.6-4.2c0-2.1,0.6-3.7,1.9-5.2l0.8-0.8l-0.4-1C21,27,21,25.8,21.4,24.3
	c0.2,0.1,0.5,0.2,0.8,0.3c1.5,0.6,2,0.9,2.2,1l0.1,0.1c0.4,0.2,0.7,0.5,1,0.6l1,0.6l0.7-0.2c1.8-0.5,3.6-0.7,5.5-0.7
	c1.9,0,3.7,0.2,5.5,0.7l0.7,0.2l1.8-1.1c0.8-0.5,1.7-0.9,2.5-1.2c0.3-0.1,0.5-0.2,0.7-0.2c0.4,1.4,0.4,2.7-0.1,3.9l-0.4,1L44,30
	c1.3,1.4,1.9,3.1,1.9,5.2c0,1.6-0.2,3-0.6,4.1c-0.4,1.1-0.8,2-1.4,2.7c-0.5,0.6-1.2,1.1-2,1.6c-1,0.5-1.8,0.8-2.6,1.1
	c-0.6,0.2-1.4,0.3-2.2,0.4c-0.7,0.1-1.3,0.6-1.6,1.3c-0.3,0.7-0.2,1.4,0.2,2.1c0.5,0.7,0.7,1.6,0.7,2.8v8c0,1.2,0.6,2.3,1.6,3
	c1,0.7,2.2,0.9,3.3,0.6C55.3,58.7,64.5,45.5,63.7,31z M40.4,59.6c-0.1,0-0.2,0-0.2,0c0,0-0.1-0.1-0.1-0.2v-8c0-1.1-0.2-2.1-0.5-3.1
	c0.3-0.1,0.5-0.1,0.8-0.2c1.1-0.3,2.1-0.7,3.4-1.4c1.3-0.8,2.2-1.6,3-2.4c1-1.1,1.5-2.5,2-3.8c0.5-1.5,0.8-3.2,0.8-5.2
	c0-2.6-0.7-4.8-2.2-6.7c0.5-2,0.3-4.2-0.6-6.5l-0.3-0.8l-0.8-0.3c-1-0.3-2.2-0.2-3.7,0.4c-1,0.4-2.1,0.9-3.1,1.5l-0.6,0.3
	c-1.9-0.5-3.7-0.7-5.7-0.7c-1.9,0-3.8,0.2-5.7,0.7c-0.2-0.1-0.4-0.2-0.6-0.4c-0.6-0.4-1.5-0.8-2.8-1.3c-1.6-0.7-2.9-0.9-3.9-0.5
	l-0.8,0.3l-0.3,0.8c-0.9,2.4-1.1,4.6-0.5,6.5c-1.4,1.9-2.2,4.2-2.2,6.7c0,1.8,0.2,3.5,0.7,5.2c0.5,1.6,1.1,2.9,1.9,3.9
	c0.9,1.1,1.9,1.9,3,2.5c1.1,0.6,2.2,1,3.3,1.3c0.3,0.1,0.5,0.1,0.8,0.2c-0.2,0.5-0.3,1.1-0.4,1.6l0,0.2c0,0,0,1.6,0,3.1
	c-2.7-0.9-4.8-2.1-6.6-4c-1.3-1.5-2.8-2.9-3.5-3.3c-1.5-0.7-2.5,0.8-2.2,1.6c0.3,1.1,1.9,1.7,2.7,2.5c0.9,1,1.1,2.3,1.9,3.3
	c1.1,1.6,4.9,3.5,7.7,3.2v3c0,0,0,0.1-0.1,0.2c0,0-0.1,0.1-0.2,0C12.4,56.5,3.8,45.3,3.8,32.5c0-7.8,3.1-15,8.7-20.4
	c5.6-5.4,13-8.2,20.8-7.9c14.6,0.6,26.4,12.4,27,26.9C60.9,44.1,52.7,55.8,40.4,59.6z" />
                            </svg>
                            Github Login
                        </div>
                    </section> `}`
            : html` <h1>
                  <span class="let1">l</span>
                  <span class="let2">o</span>
                  <span class="let3">a</span>
                  <span class="let4">d</span>
                  <span class="let5">i</span>
                  <span class="let6">n</span>
                  <span class="let7">g</span>
              </h1>`}`;
    }

    login(provider) {
        this.service.login(provider).then((user) => {
            this.logged = user;
            this.admin = user.admin;
            console.log('userLogged', this.logged);
            this.requestUpdate();
        });
    }

    click() {
        this.clickForSong = true;
        this.requestUpdate();
    }
}
customElements.define('count-down-main', Main);
