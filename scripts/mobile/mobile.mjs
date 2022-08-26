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
            grid-template-rows: 50px 1fr 100px;
            font-family: 'RumbleBrave';
        }
        header {
            background-color: rgb(193, 77, 50);
            height: 50px;
            position: relative;
        }
        img {
            height: 50px;
            position: absolute;
            right: 0;
        }
        .buttons-area {
            position: relative;
            top: 40px;
            //position: absolute;
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
                          <img
                              src="${this.service.getUser().photoURL}"
                              referrerpolicy="no-referrer" />
                      </header>
                      <world-map-mobile
                          zoom="10"
                          .continents=${this.continents}
                          .service=${this.service}></world-map-mobile>
                      <div class="buttons-area">
                          <button @click="${() => this.selectGame(GAME_TRAIN)}">
                              Train Game
                          </button>
                          <button @click="${() => this.selectGame(GAME_HORSE)}">
                              Horse Game
                          </button>
                          <button
                              @click="${() => this.selectGame(GAME_BALOON)}">
                              Baloon Game
                          </button>
                          <button
                              @click="${() => this.selectGame(GAME_SUBMARINE)}">
                              Submarine Game
                          </button>
                          <button @click="${() => this.selectGame(GAME_BOAT)}">
                              Boat Game
                          </button>
                      </div>
                  `
                : this.renderGame()}
        `;
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
}
customElements.define('count-down-mobile', Mobile);
