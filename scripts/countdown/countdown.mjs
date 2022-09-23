import { LitElement, html, css } from 'lit';
import { WorldMap } from './map.mjs';
import { ticketCss } from '../styles/shared-style.mjs';
import { CountDownHelper } from '../utilities/countdownHelper.mjs';

export class CountDown extends LitElement {
    static styles = [
        ticketCss,
        css`
            :host {
                position: absolute;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                top: 0;
                left: 0;
                display: grid;
                grid-template-rows: 1fr;
                grid-template-columns: 1fr;
                font-family: 'RumbleBrave';
            }

            .join {
                position: absolute;
                bottom: 50px;
                width: 100vw;
                text-align: center;
                z-index: 999;
                font-size: 2rem;
                text-shadow: #777 8px 8px 15px;
            }
            .scoring {
                font-size: 1.5rem;
                position: absolute;
                --witdh-card: 250px;
                --height-card: calc(100vh - 200px);
                --right-card: 50px;
                --top-card: 100px;
            }
            .countdown {
                position: absolute;
                top: 60px;
                width: 100vw;
                text-align: center;
                z-index: 999;
                font-size: 5rem;
                text-shadow: #777 8px 8px 15px;
            }

            .card-ticket .ticket .ticket-wrapper .ticket-body {
                justify-content: initial;
            }

            .top-users {
                text-align: center;
            }

            .top-user {
                margin: 15px 0;
            }

            /* LEAVE AT BOTTOM OF CSS FILE */
            .hidden {
                display: none;
            }

            #opacity {
                position: absolute;
                overflow: hidden;
                background: black;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 5s;
                z-index: 100;
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            #opacity.black {
                opacity: 1;
            }
        `,
    ];
    static properties = {
        continents: { type: Array },
        service: { type: Object },
    };

    constructor() {
        super();
        this.topUsers = [];
    }

    firstUpdated() {
        new CountDownHelper(
            this.renderRoot?.querySelector('.countdown'),
            this.renderRoot?.querySelector('#opacity')
        );
    }

    render() {
        return html`
            <section class="countdown">00:00:00</section>
            <div class="card-ticket scoring">
                <div class="ticket">
                    <div class="ticket-wrapper">
                        <div class="ticket-body">
                            Scoring :
                            <br />
                            <br />
                            <div class="top-users">
                                ${this.topUsers.length === 0
                                    ? ''
                                    : this.topUsers.map(
                                          (user) => html`
                                              <div class="top-user">
                                                  <span>${user.name} :</span>
                                                  <br />
                                                  <span
                                                      >&nbsp;&nbsp;&nbsp;${user.distance}km
                                                      / ${user.days}</span
                                                  >
                                              </div>
                                          `
                                      )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <world-map
                zoom="3"
                .continents=${this.continents}
                .service=${this.service}
                @topUsersEvent="${(event) =>
                    this.topUsersEvent(event)}"></world-map>
            <div class="join">
                Join the trip at<br />
                https://bit.ly/worldtournantes
            </div>
            <div id="opacity" style="display:none"></div>
        `;
    }

    topUsersEvent(event) {
        this.topUsers = event.detail.users;
        this.requestUpdate();
    }
}
customElements.define('count-down', CountDown);
