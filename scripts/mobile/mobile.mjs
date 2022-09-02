import { LitElement, html, css } from 'lit';
import { TrainGame } from './games/train.mjs';
import { HorseGame } from './games/horse.mjs';
import { BaloonGame } from './games/baloon.mjs';
import { SubmarineGame } from './games/submarine.mjs';
import { BoatGame } from './games/boat.mjs';
import { WorldMapMobile } from './map-mobile.mjs';

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
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 50px 20px 20px 1fr;
            font-family: 'RumbleBrave';
            --header-height: 50px;
            --color-bg: #f1f1f0;
            --color-balloon: #66bb6a;
            --color-balloon-2: #5da960;
            --color-strings: #d9d9d9;
            --color-basket: #ceb89f;
            --size-balloon: 1rem;
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
            line-height: 20px;
        }

        .progress {
            position: relative;
            background: linear-gradient(
                90deg,
                var(--primary) 0px,
                var(--primary) var(--progress-balloon),
                transparent var(--progress-balloon),
                transparent 100%
            );
        }

        .balloon {
            display: block;
            position: absolute;
            top: 0;
            left: var(--progress-balloon);
            transform: translate(-50%, -50%);
            perspective-origin: 50% 100%;
            perspective: calc(var(--size-balloon) * 0.5);
        }
        .balloon > .envelope {
            position: relative;
            display: block;
            width: var(--size-balloon);
            height: var(--size-balloon);
            background-color: var(--color-balloon);
            border-radius: var(--size-balloon);
            perspective-origin: 50% 100%;
            perspective: calc(var(--size-balloon) * 0.5);
        }
        .balloon > .envelope::before,
        .balloon > .envelope::after {
            position: absolute;
            display: block;
            content: '';
        }
        .balloon > .envelope::after {
            top: 2%;
            left: 50%;
            width: 38%;
            height: 80%;
            background-color: var(--color-balloon-2);
            transform: translateX(-50%);
            border-radius: 50%;
        }
        .balloon > .envelope::before {
            top: 15%;
            width: calc(var(--size-balloon));
            height: calc(var(--size-balloon) * 2.2);
            border-radius: calc(var(--size-balloon) / 11);
            background: linear-gradient(
                to right,
                var(--color-balloon) 0%,
                var(--color-balloon) 35%,
                var(--color-balloon-2) 35%,
                var(--color-balloon-2) 65%,
                var(--color-balloon) 65%,
                var(--color-balloon) 100%
            );
            transform: translateZ(calc(var(--size-balloon) * -0.94))
                rotateX(-58deg);
        }
        .balloon > .basket {
            position: absolute;
            top: 114%;
            left: 50%;
            display: block;
            width: calc(var(--size-balloon) / 5);
            height: calc(var(--size-balloon) / 10);
            background: linear-gradient(
                to right,
                var(--color-strings) 0%,
                var(--color-strings) 10%,
                var(--color-bg) 10%,
                var(--color-bg) 30%,
                var(--color-strings) 30%,
                var(--color-strings) 40%,
                var(--color-bg) 40%,
                var(--color-bg) 60%,
                var(--color-strings) 60%,
                var(--color-strings) 70%,
                var(--color-bg) 70%,
                var(--color-bg) 90%,
                var(--color-strings) 90%,
                var(--color-strings) 100%
            );
            border-radius: calc(var(--size-balloon) / 40);
            border-bottom: calc(var(--size-balloon) / 5.5) solid
                var(--color-basket);
            transform: translateX(-50%) rotateX(-20deg);
        }

        #destination {
            position: absolute;
            background-color: transparent;
            bottom: 50px;
            left: 50px;
            z-index: 999;
        }

        #destination .ticket {
            align-items: center;
            background-color: var(--tertiary);
            border-color: var(--primary);
            border-spacing: 2px;
            border-style: dashed none;
            border-width: 2px;
            -webkit-clip-path: polygon(
                20px 0,
                0 20px,
                0 calc(100% - 20px),
                20px 100%,
                calc(100% - 20px) 100%,
                100% calc(100% - 20px),
                100% 20px,
                calc(100% - 20px) 0
            );
            clip-path: polygon(
                20px 0,
                0 20px,
                0 calc(100% - 20px),
                20px 100%,
                calc(100% - 20px) 100%,
                100% calc(100% - 20px),
                100% 20px,
                calc(100% - 20px) 0
            );
            color: var(--primary-dark);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            height: 300px;
            justify-content: center;
            margin: auto;
            max-width: calc(100vw - 100px);
            position: relative;
            width: calc(100vw - 100px);
        }

        #destination .ticket .ticket-wrapper:after,
        #destination .ticket .ticket-wrapper:before,
        #destination .ticket:after,
        #destination .ticket:before {
            align-items: center;
            background-color: var(--primary-dark);
            border-radius: 0 0 18px 0;
            content: '';
            display: flex;
            height: 60px;
            justify-content: center;
            left: 0;
            margin: auto;
            position: absolute;
            right: 0;
            width: 60px;
            z-index: 2;
        }

        #destination .ticket .ticket-wrapper:after,
        #destination .ticket .ticket-wrapper:before {
            background-color: var(--primary);
            height: 66px;
            width: 72px;
            z-index: 1;
        }

        #destination .ticket .ticket-wrapper:before,
        #destination .ticket:before {
            top: 0;
        }

        #destination .ticket .ticket-wrapper:after,
        #destination .ticket:after {
            bottom: 0;
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
        }

        #destination .ticket:before {
            background-color: var(--primary-dark);
            background-image: url(/assets/images/chevron-stylise.png);
            background-position: 50%;
            background-repeat: no-repeat;
            background-size: 75%;
        }

        #destination .ticket:after {
            opacity: 0.3;
        }

        #destination .ticket.disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        #destination .ticket .ticket-wrapper {
            height: 100%;
            padding: 75px 10px;
        }

        #destination .ticket .ticket-wrapper .ticket-body {
            align-items: center;
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
            text-align: center;
        }

        #destination .ticket .ticket-wrapper .ticket-body .price {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: center;
        }

        #destination .ticket .ticket-wrapper .ticket-body .price hr {
            border-bottom-width: 2px;
            border-color: var(--secondary);
            border-radius: 2px;
            width: 66px;
        }

        #destination .ticket .ticket-wrapper .ticket-body .price h2 {
            color: var(--primary-dark);
            margin: 10px 0 5px;
        }

        #destination .ticket .ticket-wrapper .ticket-body .description p {
            margin: 5px 0;
        }

        #destination
            .ticket
            .ticket-wrapper
            .ticket-body
            .description
            .quantity {
            font-size: 80%;
            opacity: 0.75;
        }
    `;

    static properties = {
        continents: { type: Array },
        service: { type: Object },
    };

    render() {
        return html`
            ${this.game === 0
                ? html`
                      <header>
                          <p>${this.gdg ? this.gdg.title : ''}</p>
                          <img
                              src="${this.service.getUser().photoURL}"
                              referrerpolicy="no-referrer" />
                      </header>
                      <section class="instructions">
                          Select your destination
                      </section>
                      <section class="progress">
                          <div class="balloon">
                              <div class="envelope"></div>
                              <div class="basket"></div>
                          </div>
                      </section>
                      <world-map-mobile
                          zoom="10"
                          .continents=${this.continents}
                          .service=${this.service}
                          @gdgSelectEvent="${(event) => this.selectGDG(event)}"
                          @gdgHoverEvent="${(event) =>
                              this.hoverGDG(event)}"></world-map-mobile>
                      ${this.renderDestination()}
                  `
                : this.renderGame()}
        `;
    }

    renderDestination() {
        if (!this.destination) {
            return html``;
        }
        return html`<div id="destination">
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
                                Train Game
                            </button>
                            <button
                                @click="${() => this.selectGame(GAME_HORSE)}">
                                Horse Game
                            </button>
                            <button
                                @click="${() => this.selectGame(GAME_BALOON)}">
                                Baloon Game
                            </button>
                            <button
                                @click="${() =>
                                    this.selectGame(GAME_SUBMARINE)}">
                                Submarine Game
                            </button>
                            <button
                                @click="${() => this.selectGame(GAME_BOAT)}">
                                Boat Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    renderGame() {
        switch (this.game) {
            case GAME_TRAIN:
                return html`<train-game
                    @exitGameEvent="${() => this.selectGame(0)}"></train-game>`;
            case GAME_HORSE:
                return html`<horse-game
                    @exitGameEvent="${() => this.selectGame(0)}"></horse-game>`;
            case GAME_BALOON:
                return html`<baloon-game
                    @exitGameEvent="${() =>
                        this.selectGame(0)}"></baloon-game>`;
            case GAME_SUBMARINE:
                return html`<submarine-game
                    @exitGameEvent="${() =>
                        this.selectGame(0)}"></submarine-game>`;
            case GAME_BOAT:
                return html`<boat-game
                    @exitGameEvent="${() => this.selectGame(0)}"></boat-game>`;
        }
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

    hoverGDG(event) {
        this.destination = {
            ...event.detail.gdg,
            distance: event.detail.distance,
        };
        this.requestUpdate();
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
