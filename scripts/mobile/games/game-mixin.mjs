import { LitElement, html, css } from 'lit';
import { balloonCss } from '../../styles/shared-style.mjs';

export const GameMixin = (superclass) =>
    class extends superclass {
        static mixinStyles = [
            balloonCss,
            css`
                :host {
                    position: relative;
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-template-rows: 50px 150px 20px 20px 1fr;
                    font-family: 'RumbleBrave';
                    //grid-template-rows: 10vh 5vh 45vh 40vh;
                    --header-height: 50px;
                    --progress-balloon: 0px;
                    --icon-width: 150px;
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

                header img {
                    height: var(--header-height);
                    position: absolute;
                    right: 0;
                }

                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .instructions {
                    display: grid;
                    grid-template-columns: var(--icon-width) 1fr;
                    grid-template-rows: 1fr;
                    align-items: center;
                    text-align: center;
                    font-size: 2rem;
                }

                .instructions img {
                    width: var(--icon-width);
                    border-right: thin dotted #333;
                }

                #distanceTraveled {
                    position: relative;
                    font-size: 1rem;
                    text-align: center;
                    line-height: 20px;
                    margin-bottom: 10px;
                }

                #distanceTraveled::after {
                    content: '';
                    width: 90vw;
                    height: 1px;
                    position: absolute;
                    left: 50%;
                    bottom: -12px;
                    margin-left: -45vw;
                    border-bottom: thin dotted #333;
                }
            `,
        ];

        constructor() {
            super();
            this.totalDistanceTraveled = 0;
            this.timer = undefined;
        }

        static properties = {
            distanceToRun: { type: Number },
            service: { type: Object },
        };

        /**
         * Start the timer only
         */
        startTimer() {
            if (!this.timer) {
                this.timer = Date.now();
            }
        }

        incrementDistance(distanceToIncrement) {
            // Update traveled distance
            this.totalDistanceTraveled += distanceToIncrement;
            this.requestUpdate();

            const width = Math.round(
                100 * (this.totalDistanceTraveled / this.distanceToRun)
            );
            this.renderRoot
                ?.querySelector('.progress')
                .style?.setProperty('--progress-balloon', `${width}vw`);

            // If we arrived
            if (this.totalDistanceTraveled > this.distanceToRun) {
                console.log('Game Finish in : ' + (Date.now() - this.timer));
                this.finishEvent(Date.now() - this.timer);
            }
        }

        renderGameSkeleton(header, srcImg, instruction, game) {
            return html`
                <header>
                    <p @click="${() => this.quitEvent()}">←${header}</p>
                    <img
                        src="${this.service.getUser().photoURL}"
                        referrerpolicy="no-referrer" />
                    <!--<button @click="${this.quitEvent}">Quit</button>-->
                </header>
                <section class="instructions">${instruction}</section>
                <section class="progress">
                    <img src="${srcImg}" />
                    <!--<div class="balloon">
                        <div class="envelope"></div>
                        <div class="basket"></div>
                    </div>-->
                </section>
                <div id="distanceTraveled">
                    distance traveled: ${this.totalDistanceTraveled}m /
                    ${this.distanceToRun}m 🏁
                </div>
                <section class="game">${game}</section>
            `;
        }

        quitEvent() {
            const event = new CustomEvent('exitGameEvent', {
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(event);
        }

        finishEvent(time) {
            const event = new CustomEvent('finishGameEvent', {
                detail: { time, distance: this.distanceToRun },
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(event);
        }
    };
