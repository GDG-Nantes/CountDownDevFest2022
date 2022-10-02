import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class BoatGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 4500;

        let delayedActionId;
        let touchstartX = 0;
        let touchendX = 0;

        const checkDirection = () => {
            if (touchendX < touchstartX) {
                if (delayedActionId) {
                    clearTimeout(delayedActionId);
                }

                this.startAnimation();
                this.runOneStep();
                delayedActionId = setTimeout(() => this.stopAnimation(), 1000);
            }
        };

        this.addEventListener('touchstart', (e) => {
            touchstartX = e.changedTouches[0].screenX;
        });

        this.addEventListener('touchend', (e) => {
            touchendX = e.changedTouches[0].screenX;
            checkDirection();
        });
    }

    static properties = {};
    static styles = [
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

            #boatFrame {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #70c4c6;
                position: relative;
                width: 100vw;
                overflow: hidden;
                flex-grow: 1;

            }

            #boatImage {
                margin-top: 7vh;
                margin-left: 15vw;
                z-index: 5;
            }

            #boatActionPanel {
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

            .cloud {
                width: 50px;
                height: 45px;
                border-radius: 50%;
                background-color: #fff;
                position: absolute;
                top: 20px;
                left: -20%;
                animation-name: cloud;
                animation-duration: 70s;
                animation-iteration-count: infinite;
                animation-play-state: paused;
            }

            .cloud::before {
                content: '';
                width: 35px;
                height: 30px;
                background-color: #fff;
                margin-left: -20px;
                margin-top: 10px;
                display: block;
                border-radius: 50%;
            }

            .cloud::after {
                content: '';
                width: 20px;
                height: 20px;
                background-color: #fff;
                position: absolute;
                right: -10px;
                top: 17px;
                border-radius: 50%;
            }

            .cloud.a {
                top: 1550px;
                animation-duration: 55s;
                z-index: 3;
            }

            .cloud.b {
                top: 100px;
                left: -15%;
                animation-duration: 38s;
                z-index: 8;
            }

            .cloud.c {
                top: 205px;
                left: -10%;
                animation-duration: 25s;
                z-index: 4;
            }

            .wind {
                width: 150px;
                background-color: #eee;
                height: 2px;
                position: absolute;
                top: 30%;
                animation-name: wind;
                animation-duration: 5s;
                animation-iteration-count: infinite;
                animation-timing-function: linear;
                animation-play-state: paused;
                z-index: 1;
            }

            .wind::before {
                content: '';
                position: absolute;
                left: 200px;
                width: 100px;
                height: 1px;
                background-color: #eee;
                top: 100px;
            }

            .wind::after {
                content: '';
                position: absolute;
                left: 400px;
                width: 180px;
                height: 1px;
                background-color: #eee;
                top: 30px;
            }

            @keyframes cloud {
                0% {
                    transform: translateX(140vw);
                }
                100% {
                    transform: translateX(-30vw);
                }
            }

            @keyframes wind {
                0% {
                    left: 100vw;
                    opacity: 0;
                }
                15% {
                    opacity: 1;
                }
                70% {
                    left: -100vw;
                    opacity: 1;
                }
                80% {
                    left: -100vw;
                    opacity: 0;
                }
                100% {
                    left: 120vw;
                    opacity: 0;
                }
            }

            .animation-paused {
                animation-play-state: paused;
            }

            .animation-running {
                animation-play-state: running;
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
        return html`
            <div class="">Swipe left to navigate</div>`;
    }

    renderGame() {
        return html` <div id="boatFrame">
                <div id="cloud" class="cloud animation-paused"></div>
                <div id="cloud-a" class="cloud a animation-paused"></div>
                <div id="cloud-b" class="cloud b animation-paused"></div>
                <div id="cloud-c" class="cloud c animation-paused"></div>
                <div id="wind" class="wind animation-paused"></div>
                <img
                    src="./assets/boat-game/boat-steampunk.gif"
                    id="boatImage" />
            </div>
            <div id="boatActionPanel">
                <div id="long-arrow-left"></div>
                <div>Swipe left here<br />to turn the propellers</div>
            </div>`;
    }

    startAnimation() {
        this.renderRoot
            ?.querySelector('#cloud')
            .classList.replace('animation-paused', 'animation-running');
        this.renderRoot
            ?.querySelector('#cloud-a')
            .classList.replace('animation-paused', 'animation-running');
        this.renderRoot
            ?.querySelector('#cloud-b')
            .classList.replace('animation-paused', 'animation-running');
        this.renderRoot
            ?.querySelector('#cloud-c')
            .classList.replace('animation-paused', 'animation-running');
        this.renderRoot
            ?.querySelector('#wind')
            .classList.replace('animation-paused', 'animation-running');
    }

    stopAnimation() {
        this.renderRoot
            ?.querySelector('#cloud')
            .classList.replace('animation-running', 'animation-paused');
        this.renderRoot
            ?.querySelector('#cloud-a')
            .classList.replace('animation-running', 'animation-paused');
        this.renderRoot
            ?.querySelector('#cloud-b')
            .classList.replace('animation-running', 'animation-paused');
        this.renderRoot
            ?.querySelector('#cloud-c')
            .classList.replace('animation-running', 'animation-paused');
        this.renderRoot
            ?.querySelector('#wind')
            .classList.replace('animation-running', 'animation-paused');
    }

    runOneStep() {
        this.startTimer();

        // Update traveled distance
        this.incrementDistance(this.distanceTraveledByStep);
    }
}
customElements.define('boat-game', BoatGame);
