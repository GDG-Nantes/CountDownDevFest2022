import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';
import { cloudCss } from '../../styles/shared-style.mjs';

const State = {
    IDLE: 1,
    RECV: 2,
};
export class BaloonGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 500;

        /**
         * Params linked to audio Frequency Engine
         */

        this.heightBallon = 0;
        this.isRunning = false; // Listening is running
        this.iteration = 0; // Iteration of frequency analysis (to check every 5 seconds)

        this.limitThreadshold = 0;
        this.iterationThreadshold = 40;
        this.iterationOverThreshold = 0;
    }

    static properties = {};
    static styles = [
        cloudCss,
        this.mixinStyles,
        css`
            :host {
                --size-balloon: 29px;
                --icon-src: url('./assets/baloon-game/air-baloon.svg');
            }

            .main-balloon {
                position: relative;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 100px;
                width: 100%;
                height: 100%;
                overflow: hidden;
                --size-balloon: 15rem;
                --progress-balloon: calc(100vw - 50%);
            }

            .balloon-wrapper {
                position: relative;
                background: #70c4c6;
            }

            .main-balloon .balloon {
                top: initial;
                --bottom-balloon: -70px;
                bottom: var(--bottom-balloon);
                animation: bottom 100ms linear 0;
                background: #70c4c6;
            }

            .line-limit::before {
                position: absolute;
                content: 'line to pass for a valid move';
                font-size: 1.5rem;
                top: -1.5rem;
            }

            .line-limit {
                position: relative;
                border-top: thin dotted black;
                text-align: center;
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            .blow-instruction {
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 2rem;
                display: flex;
                align-items: center;
                align-content: center;
                justify-content: center;
            }

            .push_button {
                position: relative;
                width: 200px;
                color: #fff;
                display: block;
                text-decoration: none;
                margin: 0 auto;
                border-radius: 5px;
                border: solid 1px #d94e3b;
                background: #cb3b27;
                text-align: center;
                padding: 20px 30px;
                font-size: 25px;

                -webkit-transition: all 0.1s;
                -moz-transition: all 0.1s;
                transition: all 0.1s;

                -webkit-box-shadow: 0px 9px 0px #84261a;
                -moz-box-shadow: 0px 9px 0px #84261a;
                box-shadow: 0px 9px 0px #84261a;
            }
            .push_button:active {
                -webkit-box-shadow: 0px 2px 0px #84261a;
                -moz-box-shadow: 0px 2px 0px #84261a;
                box-shadow: 0px 2px 0px #84261a;
                position: relative;
                top: 7px;
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
        return html`Baloon Game`;
    }

    renderInstruction() {
        return html` <div class="">Keep the ballon above the line</div>`;
    }
    disconnectedCallback() {
        this.stop();
    }

    renderGame() {
        return this.renderGameArea();
    }

    renderGameArea() {
        return html`
            <div class="main-balloon">
                <div class="balloon-wrapper">
                    <div id="cloud" class="cloud animation-paused"></div>
                    <div id="cloud-a" class="cloud a animation-paused"></div>
                    <div id="cloud-b" class="cloud b animation-paused"></div>
                    <div id="cloud-c" class="cloud c animation-paused"></div>
                    <div id="wind" class="wind animation-paused"></div>
                    <div class="balloon">
                        <div class="envelope"></div>
                        <div class="basket"></div>
                    </div>
                </div>
                <div class="line-limit">
                    <a
                        href="#"
                        class="push_button"
                        @click="${() => this.push()}">
                        Push Me
                    </a>
                </div>
            </div>
        `;
    }

    push() {
        this.heightBallon = Math.min(this.heightBallon + 100, 300);
        if (!this.isRunning) {
            this.isRunning = true;
            this.customRaf();
        }
    }

    displayBalloon(freq) {
        if (!this.balloonElt) {
            this.balloonElt = this.renderRoot?.querySelector(
                '.main-balloon .balloon'
            );
        }

        const bottom = freq;

        this.balloonElt.style?.setProperty('--bottom-balloon', `${bottom}px`);
    }

    runOneStep() {
        this.startTimer();

        // Update traveled distance
        this.incrementDistance(this.distanceTraveledByStep);
    }

    finishEvent(time) {
        super.finishEvent(time);
        console.log('Override Finish');
        this.stop();
    }

    /**
     * Audio frequency Engine
     */

    stop() {
        this.isRunning = false;
    }

    customRaf() {
        this.displayBalloon(this.heightBallon);
        if (this.heightBallon > this.limitThreadshold) {
            this.animateWindAndCloud();
            this.runOneStep();
        }
        if (this.isRunning) {
            requestAnimationFrame(this.customRaf.bind(this));
        }

        this.heightBallon = Math.max(-70, this.heightBallon - 5);
    }
}
customElements.define('baloon-game', BaloonGame);
