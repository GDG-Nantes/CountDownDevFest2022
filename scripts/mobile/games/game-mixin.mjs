import { LitElement, html, css } from 'lit';
import { balloonCss } from '../../styles/shared-style.mjs';

export const GameMixin = (superclass) =>
    class extends superclass {
        static mixinStyles = [
            balloonCss,
            css`
                :host {
                    position: relative;
                    display: flex;
                    flex-direction: column;
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

                .game { 
                    flex-grow: 1;
                    background-image: linear-gradient(0deg, rgba(195,125,34,0.7) 0%, rgba(253,187,45,0.5) 100%), 
                    url('./assets/images/asfalt-dark.png');
                }

                .instructions {
                    position: absolute;
                    top: 70px;
                    display: flex;
                    justify-content: center;
                    width: 100vw;
                    padding: 20px;
                    box-sizing: border-box;
                }

                    .floating-instructions {
                        border: 30px solid;
                        box-sizing: border-box;
                        border-image-source: url('./assets/images/frame-2.svg');
                        border-image-slice: 23;
                        background-clip: content-box;
                        background-color: rgb(33, 75, 96);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: white;
                        z-index: 50;
                        padding: 30px:
                        flex-grow: 1;
                        width: 100%;
                        font-family: "Pokemon", monospace;
                    }

                        .floating-instructions  {

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
            this.ratioTimeDist = 1;
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

            this.ratioTimeDist = Math.round(this.distanceToRun / (100 * 1000));
        }

        incrementDistance(distanceToIncrement) {
            // Update traveled distance
            this.totalDistanceTraveled +=
                distanceToIncrement * this.ratioTimeDist;
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
                this.finishEvent(
                    (Date.now() - this.timer) * this.ratioTimeDist
                );
            }
        }

        renderGameSkeleton(header, instruction, game) {
            return html`
                <header>
                    <p @click="${() => this.quitEvent()}">←${header}</p>
                    <img
                        src="${this.service.getUser().photoURL}"
                        referrerpolicy="no-referrer" />
                </header>
                <section class="instructions">
                    <section class="floating-instructions">
                        ${instruction}
                    </section>
                </section>
                <section class="game">
                    ${game}
                </section>
                <section class="progress">
                    <section class="progress-bar"></section>
                    <i class="progress-icon"></i>
                </section>
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
