import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class HorseGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.horseRunStep = 0;
        this.nbAnimationSteps = 6;
        this.distanceTraveledByStep = 1500;
        this.nextStepHasToBeRight = true;
    }

    static styles = [
        this.mixinStyles,
        css`
            :host {
                --size-balloon: 29px;
            }
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
                width: 166px;
                height: 120px;
                background: url('../../../assets/horse-game/horse-insane-run.png')
                    no-repeat;
                display: inline-block;
            }
            #horserun.horserun0 {
                background-position: 0px 0px;
            }
            #horserun.horserun1 {
                background-position: -166px 0px;
            }
            #horserun.horserun2 {
                background-position: -332px 0px;
            }
            #horserun.horserun3 {
                background-position: -498px 0px;
            }
            #horserun.horserun4 {
                background-position: -664px 0px;
            }
            #horserun.horserun5 {
                background-position: -830px 0px;
            }
            #horserun.horserun6 {
                background-position: -996px 0px;
            }
            #distanceTraveled {
                text-align: center;
            }
            #horseshoes {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-around;
            }
            #horseshoes button {
                border: 0;
                width: 28vw;
                height: 15vh;
                -webkit-mask: url(./assets/horse-game/horseshoe.svg) no-repeat
                    50% 50%;
                mask: url(./assets/horse-game/horseshoe.svg) no-repeat 50% 50%;
                -webkit-mask-size: contain;
                transform: rotate(-90deg);
                mask-size: contain;
                background-color: var(--primary-dark);
                margin-left: 0;
            }
            #horseshoes button.colored {
                background-color: var(--primary);
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
            './assets/horse-game/horse.svg',
            this.renderInstruction(),
            this.renderGame()
        );
    }

    renderHeader() {
        return html`Horse Game`;
    }

    renderInstruction() {
        return html`<img src="./assets/horse-game/horse.svg" />
            <div class="">Tap on the colored horse shoe</div>`;
    }

    renderGame() {
        return html` <div id="horserunFrame">
                <div id="horserun" class="horserun0"></div>
            </div>
            <div id="horseshoes">
                <button
                    id="horseLeftShoe"
                    @click="${() => this.leftHorseShoeClick()}"
                    class="${!this.nextStepHasToBeRight
                        ? 'colored'
                        : ''}"></button>
                <button
                    id="horseRightShoe"
                    @click="${() => this.rightHorseShoeClick()}"
                    class="${this.nextStepHasToBeRight
                        ? 'colored'
                        : ''}"></button>
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
