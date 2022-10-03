import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';
import { cloudCss } from '../../styles/shared-style.mjs';

export class BoatGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 4500;

        let touchstartX = 0;
        let touchendX = 0;

        const checkDirection = () => {
            console.log('checkDirection');
            if (touchendX < touchstartX) {
                this.animateWindAndCloud();
                this.runOneStep();
            }
        };

        this.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchstartX = e.changedTouches[0].screenX;
        });

        this.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchendX = e.changedTouches[0].screenX;
            checkDirection();
        });
    }

    static properties = {};
    static styles = [
        cloudCss,
        this.mixinStyles,
        css`
            :host {
                --size-balloon: 29px;
                --icon-src: url('./assets/boat-game/boat.svg');
            }

            .game {
                position: relative;
                display: flex;
                flex-direction: column;
            }

            #boat-frame {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #70c4c6;
                position: relative;
                width: 100vw;
                overflow: hidden;
                flex-grow: 1;
            }

            #boat-image {
                margin-top: 15vh;
                margin-left: 15vw;
                z-index: 5;
            }

            #boat-action-panel {
                display: flex;
                justify-content: center;
                font-size: larger;
                padding: 20px;
            }

            #long-arrow-left {
                display: block;
                margin: 13px 20px 8px 0px;
                width: 15px;
                height: 15px;
                border-top: 2px solid #000;
                border-left: 2px solid #000;
                transform: rotate(-45deg);
            }

            #long-arrow-left::after {
                content: '';
                display: block;
                width: 2px;
                height: 30px;
                background-color: black;
                transform: rotate(-45deg) translate(10px, 4px);
                left: 0;
                top: 0;
            }
        `,
    ];

    render() {
        return this.renderGameSkeleton(
            this.renderHeader(),
            this.renderInstruction(),
            this.renderGame()
        );
    }

    renderHeader() {
        return html`Boat Game`;
    }

    renderInstruction() {
        return html` <div class="">Swipe left to navigate</div>`;
    }

    renderGame() {
        return html` <div id="boat-frame">
                <div id="cloud" class="cloud animation-paused"></div>
                <div id="cloud-a" class="cloud a animation-paused"></div>
                <div id="cloud-b" class="cloud b animation-paused"></div>
                <div id="cloud-c" class="cloud c animation-paused"></div>
                <div id="wind" class="wind animation-paused"></div>
                <img
                    src="./assets/boat-game/boat-steampunk.gif"
                    id="boat-image" />
            </div>
            <div id="boat-action-panel">
                <div id="long-arrow-left"></div>
                <div>Swipe left here<br />to turn the propellers</div>
            </div>`;
    }

    runOneStep() {
        this.startTimer();

        // Update traveled distance
        this.incrementDistance(this.distanceTraveledByStep);
    }
}
customElements.define('boat-game', BoatGame);
