import { LitElement, html, css } from 'lit';
import { TrainGame } from './games/train.mjs';
import { HorseGame } from './games/horse.mjs';
import { BaloonGame } from './games/baloon.mjs';
import { SubmarineGame } from './games/submarine.mjs';
import { BoatGame } from './games/boat.mjs';
import { WorldMapMobile } from './map-mobile.mjs';
import { buttonCss, balloonCss, ticketCss } from '../styles/shared-style.mjs';

const GAME_TRAIN = 1;
const GAME_HORSE = 2;
const GAME_BALOON = 3;
const GAME_SUBMARINE = 4;
const GAME_BOAT = 5;

export class Mobile extends LitElement {
    constructor() {
        super();
        this.game = 0;
        this.destination = undefined;
        this.endGame = undefined;
        this.resetGame = false;
        this.timeGame = 0;
        this.globalDistance = 0;
        this.instructionRead = false;
    }

    static styles = [
        buttonCss,
        balloonCss,
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
                grid-template-columns: 1fr;
                grid-template-rows: 50px 40px 20px 1fr;
                font-family: 'RumbleBrave';
                --header-height: 50px;
                --progress-balloon: 0px;
            }
            header {
                background-color: rgb(193, 77, 50);
                height: var(--header-height);
                position: relative;
                display: grid;
                grid-template-columns: 1fr 75px;
                grid-template-rows: 1fr;
            }

            header p {
                padding: 0 0 0 20px;
                margin: 0;
                color: white;
                font-size: 1.5rem;
                line-height: var(--header-height);
                height: var(--header-height);
            }

            img {
                height: var(--header-height);
                position: absolute;
                right: 0;
            }
            .buttons-area {
                position: relative;
            }
            .gdg-target {
                font-size: 1.5rem;
            }

            .instructions {
                text-align: center;
                line-height: 40px;
                font-size: 1.2rem;
            }

            .card-ticket {
                --bottom-card: 10vh;
                --left-card: 5vw;
                --witdh-card: calc(100vw - 10vw);
                --height-card: 55vh;
            }

            .game-instructions-wrapper {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--secondary);
            }

            .card-ticket.game-instructions {
                margin-top: -40vh;
                --top-card: 50%;
                --height-card: 80vh;
            }

            .card-ticket .ticket::after,
            .card-ticket .ticket .ticket-wrapper::after {
                display: none;
            }

            train-game,
            horse-game,
            baloon-game,
            submarine-game,
            boat-game {
                position: absolute;
                top: 0;
                left: 0;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    var(--tertiary-dark) 0,
                    var(--tertiary) 30%,
                    var(--tertiary) 70%,
                    var(--tertiary-dark) 100%
                );
                z-index: 1000;
            }

            button {
                margin: 5px;
            }

            button .icon.icon-balloon {
                -webkit-mask: url(./assets/baloon-game/air-baloon.svg) no-repeat
                    50% 50%;
                mask: url(./assets/baloon-game/air-baloon.svg) no-repeat 50% 50%;
                -webkit-mask-size: cover;
                mask-size: cover;
            }
            button .icon.icon-horse {
                -webkit-mask: url(./assets/horse-game/horse.svg) no-repeat 50%
                    50%;
                mask: url(./assets/horse-game/horse.svg) no-repeat 50% 50%;
                -webkit-mask-size: cover;
                mask-size: cover;
            }
            button .icon.icon-train {
                -webkit-mask: url(./assets/train-game/train.svg) no-repeat 50%
                    50%;
                mask: url(./assets/train-game/train.svg) no-repeat 50% 50%;
                -webkit-mask-size: cover;
                mask-size: cover;
            }
            button .icon.icon-boat {
                -webkit-mask: url(./assets/boat-game/boat.svg) no-repeat 50% 50%;
                mask: url(./assets/boat-game/boat.svg) no-repeat 50% 50%;
                -webkit-mask-size: cover;
                mask-size: cover;
            }
            button .icon.icon-submarine {
                -webkit-mask: url(./assets/submarine-game/submarine.svg)
                    no-repeat 50% 50%;
                mask: url(./assets/submarine-game/submarine.svg) no-repeat 50%
                    50%;
                -webkit-mask-size: cover;
                mask-size: cover;
            }

            button .icon {
                width: 30px;
                height: 30px;
                margin-right: 5px;
                background-color: white;
            }
        `,
    ];

    static properties = {
        continents: { type: Array },
        service: { type: Object },
    };

    renderInstructions() {
        return html`<div class="game-instructions-wrapper">
            <div class="card-ticket game-instructions">
                <div class="ticket">
                    <div class="ticket-wrapper">
                        <div class="ticket-body">
                            <div class="gdg-target">
                                You will have to navigate accross the different
                                GDGs of the world 🧭.
                                <br />
                                <br />
                                To navigate, click on GDG and choose the game to
                                play to validate your travel.
                                <br />
                                <br />
                                Be the faster to came back to GDG Nantes ⏱ !
                            </div>
                            <div class="buttons-area">
                                <button
                                    @click="${() => this.readInstructions()}">
                                    Play
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    render() {
        if (!this.instructionRead) {
            return this.renderInstructions();
        } else {
            return html`
                <header>
                    <p>${this.gdg ? this.gdg.title : ''}</p>
                    <img
                        src="${this.service.getUser().photoURL}"
                        referrerpolicy="no-referrer" />
                </header>
                <section class="instructions">
                    Select your next destination
                </section>
                <section class="progress">
                    <div class="balloon">
                        <div class="envelope"></div>
                        <div class="basket"></div>
                    </div>
                </section>
                <world-map-mobile
                    zoom="6"
                    .continents=${this.continents}
                    .service=${this.service}
                    .reset=${this.resetGame}
                    @click=${(event) => this.clikOutside(event)}
                    @finishEvent="${(event) => this.finish(event)}"
                    @gdgSelectEvent="${(event) => this.selectGDG(event)}"
                    @debugFinishGameEvent="${(event) => this.finishGame(event)}"
                    @gdgHoverEvent="${(event) =>
                        this.hoverGDG(event)}"></world-map-mobile>
                ${this.renderDestination()} ${this.renderEndGame()}
                ${this.renderGame()}
            `;
        }
    }

    renderDestination() {
        if (!this.destination) {
            return html``;
        }
        return html`<div class="card-ticket">
            <div class="ticket">
                <div class="ticket-wrapper">
                    <div class="ticket-body">
                        <div class="gdg-target">
                            Destination:
                            ${this.destination
                                ? `${this.destination.city} (${this.destination.country}) -> ${this.destination.distance} km`
                                : ''}
                        </div>
                        <div class="buttons-area">
                            <button
                                @click="${() => this.selectGame(GAME_TRAIN)}">
                                <i class="icon icon-train"></i>
                                Train
                            </button>
                            <button
                                @click="${() => this.selectGame(GAME_HORSE)}">
                                <i class="icon icon-horse"></i>
                                Horse
                            </button>
                            <button
                                @click="${() => this.selectGame(GAME_BALOON)}">
                                <i class="icon icon-balloon"></i>
                                Baloon
                            </button>
                            <button
                                @click="${() =>
                                    this.selectGame(GAME_SUBMARINE)}">
                                <i class="icon icon-submarine"></i>
                                Submarine
                            </button>
                            <button
                                @click="${() => this.selectGame(GAME_BOAT)}">
                                <i class="icon icon-boat"></i>
                                Boat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    renderEndGame() {
        if (!this.endGame) {
            return html``;
        }
        return html`<div class="card-ticket">
            <div class="ticket">
                <div class="ticket-wrapper">
                    <div class="ticket-body">
                        <div class="gdg-target">
                            Congrats! You finish your worldtour with
                            ${this.endGame
                                ? `${this.endGame.distance / 1000} km and in ${
                                      this.endGame.days
                                  } days`
                                : ''}
                        </div>
                        <div class="buttons-area">
                            <button @click="${() => this.reset()}">
                                Try again to do better
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    renderGame() {
        if (this.game === 0) {
            return html``;
        }
        switch (this.game) {
            case GAME_TRAIN:
                return html`<train-game
                    .service=${this.service}
                    .distanceToRun=${this.destination.distance * 1000}
                    @exitGameEvent="${() => this.selectGame(0)}"
                    @finishGameEvent="${(event) =>
                        this.finishGame(event)}"></train-game>`;
            case GAME_HORSE:
                return html`<horse-game
                    .service=${this.service}
                    .distanceToRun=${this.destination.distance * 1000}
                    @exitGameEvent="${() => this.selectGame(0)}"
                    @finishGameEvent="${(event) =>
                        this.finishGame(event)}"></horse-game>`;
            case GAME_BALOON:
                return html`<baloon-game
                    .service=${this.service}
                    .distanceToRun=${this.destination.distance * 1000}
                    @exitGameEvent="${() => this.selectGame(0)}"
                    @finishGameEvent="${(event) =>
                        this.finishGame(event)}"></baloon-game>`;
            case GAME_SUBMARINE:
                return html`<submarine-game
                    .service=${this.service}
                    .distanceToRun=${this.destination.distance * 1000}
                    @exitGameEvent="${() => this.selectGame(0)}"
                    @finishGameEvent="${(event) =>
                        this.finishGame(event)}"></submarine-game>`;
            case GAME_BOAT:
                return html`<boat-game
                    .service=${this.service}
                    .distanceToRun=${this.destination.distance * 1000}
                    @exitGameEvent="${() => this.selectGame(0)}"
                    @finishGameEvent="${(event) =>
                        this.finishGame(event)}"></boat-game>`;
        }
    }

    finishGame(event) {
        console.log('finishGame', event, event.detail);
        this.timeGame += event.detail.time;
        this.globalDistance += event.detail.distance;
        this.selectGame(0);
        const mapElt =
            this.renderRoot?.querySelector('world-map-mobile') ?? null;
        mapElt.clickOnTargetGDG(this.destination, this.destination);
    }

    reset() {
        this.resetGame = true;
        setTimeout(() => {
            this.resetGame = false;
            this.endGame = undefined;
            this.globalDistance = 0;
            this.timeGame = 0;
            this.requestUpdate();
        }, 100);
        this.requestUpdate();
    }

    readInstructions() {
        this.instructionRead = true;
        this.requestUpdate();
    }

    selectGame(game) {
        this.game = game;
        this.requestUpdate();
    }

    selectGDG(event) {
        this.gdg = event.detail.gdg;
        this.destination = undefined;
        this.calculateProgress(this.gdg);
        this.requestUpdate();
    }

    clikOutside(event) {
        console.log('clickOutside', this.destination);
        if (this.destination) {
            this.destination = undefined;
            const mapElt =
                this.renderRoot?.querySelector('world-map-mobile') ?? null;
            mapElt.destination = undefined;
            this.requestUpdate();
        }
    }

    hoverGDG(event) {
        this.destination = {
            ...event.detail.gdg,
            distance: event.detail.distance,
        };
        this.requestUpdate();
    }

    finish(event) {
        const days = Math.round(this.timeGame / 1000 / 32);
        this.endGame = {
            distance: this.globalDistance,
            days,
        };
        this.requestUpdate();
        this.service
            .finishGame(this.globalDistance, days)
            .then(() => console.log('finish'));
    }

    calculateProgress(gdg) {
        const longitude =
            ((gdg.longitude < 0 ? 360 + gdg.longitude : gdg.longitude) + 1.57) %
            360.0;
        const width = Math.round(100 / (360 / longitude));
        console.log('Progress', gdg.longitude, longitude, width);
        this.renderRoot
            ?.querySelector('.progress')
            .style?.setProperty('--progress-balloon', `${width}vw`);
    }
}
customElements.define('count-down-mobile', Mobile);
