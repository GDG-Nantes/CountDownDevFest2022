import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';
import { landCss } from '../../styles/shared-style.mjs';

export class HorseGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.horseRunStep = 0;
        this.nbAnimationSteps = 6;
        this.distanceTraveledByStep = 1900;
        this.nextStepHasToBeRight = true;
    }

    static styles = [
        landCss,
        this.mixinStyles,
        css`
            :host {
                --size-balloon: 29px;
                --icon-src: url('./assets/horse-game/horse.svg');
            }
            .game {
                position: relative;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 40vh;
            }

            #horserun-frame {
                overflow: hidden;
                position: relative;
                background: var(--sky-blue-color);
            }
            #horserun {
                width: 166px;
                height: 120px;
                background: url('../../../assets/horse-game/horse-insane-run.png')
                    no-repeat;
                display: inline-block;
                position: absolute;
                bottom: 2vh;
                left: 10vw;
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
                position: relative;
                border: 0;
                width: 28vw;
                height: 28vw;
                border-radius: 100%;
                transform: rotate(-90deg);
                mask-size: contain;
                background-color: transparent;
                margin-left: 0;
                padding: 20px;
                box-sizing: border-box;
            }
            #horseshoes button.colored {
                background-color: var(--primary);
            }

            #horseshoes button img {
                height: 100%;
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
        return html` <div class="">Tap on the colored horse shoe</div>`;
    }

    renderGame() {
        return html`
            <div id="horserun-frame">
                <div class="land">
                    <div id="tree" class="tree animation-paused"></div>
                    <div id="tree-a" class="tree a animation-paused"></div>
                    <div id="tree-b" class="tree b animation-paused"></div>
                    <div id="horserun" class="horserun0"></div>
                    <div id="tree-c" class="tree c animation-paused"></div>
                    <div id="tree-d" class="tree d animation-paused"></div>
                </div>
            </div>
            <div id="horseshoes">
                <button
                    id="horseLeftShoe"
                    @click="${() => this.leftHorseShoeClick()}"
                    class="${!this.nextStepHasToBeRight ? 'colored' : ''}">
                    <img src="./assets/horse-game/horseshoe.svg" />
                </button>
                <button
                    id="horseRightShoe"
                    @click="${() => this.rightHorseShoeClick()}"
                    class="${this.nextStepHasToBeRight ? 'colored' : ''}">
                    <img src="./assets/horse-game/horseshoe.svg" />
                </button>
            </div>
        `;
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
            this.animateLandscape();
            this.runOneStep();
        }
    }

    rightHorseShoeClick() {
        if (this.nextStepHasToBeRight) {
            this.animateLandscape();
            this.runOneStep();
        }
    }
}
customElements.define('horse-game', HorseGame);
