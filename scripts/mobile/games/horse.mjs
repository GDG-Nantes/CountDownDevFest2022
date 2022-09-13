import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class HorseGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.horseRunStep = 0;
        this.nbAnimationSteps = 6;
        this.distanceTraveledByStep = 1000;
        this.nextStepHasToBeRight = true;
    }

    static styles = [
        this.mixinStyles,
        css`
            .game {
                position: relative;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr;
            }

            #horserunFrame {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #horserun {
                width: 60px;
                height: 60px;
                background: url('../../../assets/horse-game/horse-run.png')
                    no-repeat;
                display: inline-block;
                transform: scale(3);
            }
            #horserun.horserun0 {
                background-position: 0px;
            }
            #horserun.horserun1 {
                background-position: -300px;
            }
            #horserun.horserun2 {
                background-position: -240px;
            }
            #horserun.horserun3 {
                background-position: -180px;
            }
            #horserun.horserun4 {
                background-position: -120px;
            }
            #horserun.horserun5 {
                background-position: -60px;
            }
            #distanceTraveled {
                text-align: center;
            }
            #horseshoes {
                padding-top: 5vh;
                display: flex;
                justify-content: space-evenly;
            }
            #horseshoes button {
                border: 0;
                width: 30vw;
                height: 15vh;
                background: url(../../../assets/horse-game/horseshoe.svg)
                    no-repeat;
            }
            #horseshoes button.colored {
                color: #c14d32;
                font-weight: bold;
                text-decoration: underline;
            }

            .icon {
                width: var(--icon-width);
                height: var(--icon-width);
                background: url(../../../assets/horse-game/horse.svg) no-repeat;
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
        return html`Horse Game`;
    }

    renderInstruction() {
        return html`<img src="./assets/horse-game/horse.svg" />
            <div class="">Tap on each Horseshoe</div>`;
    }

    renderGame() {
        return html` <div id="horserunFrame">
                <div id="horserun" class="horserun0"></div>
            </div>
            <div id="horseshoes">
                <button
                    id="horseLeftShoe"
                    @click="${() => this.leftHorseShoeClick()}"
                    class="${!this.nextStepHasToBeRight ? 'colored' : ''}">
                    Gauche
                </button>
                <button
                    id="horseRightShoe"
                    @click="${() => this.rightHorseShoeClick()}"
                    class="${this.nextStepHasToBeRight ? 'colored' : ''}">
                    Droite
                </button>
            </div>`;
    }

    runOneStep() {
        this.startTimer();
        // Animate horse
        const oldStep = this.horseRunStep % this.nbAnimationSteps;
        const newStep = ++this.horseRunStep % this.nbAnimationSteps;
        this.renderRoot
            ?.querySelector('#horserun')
            .classList.replace(`horserun${oldStep}`, `horserun${newStep}`);

        // Switch to next step (left or right)
        this.nextStepHasToBeRight = !this.nextStepHasToBeRight;

        // Update traveled distance
        this.incrementDistance(this.distanceTraveledByStep);
    }

    leftHorseShoeClick() {
        if (!this.nextStepHasToBeRight) {
            this.runOneStep();
        }
    }

    rightHorseShoeClick() {
        if (this.nextStepHasToBeRight) {
            this.runOneStep();
        }
    }
}
customElements.define('horse-game', HorseGame);
