import { LitElement, html, css } from 'lit';

export class HorseGame extends LitElement {
    constructor() {
        super();
        this.horseRunStep = 0;
        this.nbAnimationSteps = 6;
        this.distanceTraveledByStep = 1000;
        this.totalDistanceTraveled = 0;
        this.nextStepHasToBeRight = true;
        this.timer = undefined;
    }

    static styles = css`
        :host {
            position: relative;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 10vh 45vh 5vh 40vh;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            background: url(../../../assets/horse-game/horseshoe.svg) no-repeat;
        }
        #horseshoes button.colored {
            color: #c14d32;
            font-weight: bold;
            text-decoration: underline;
        }
    `;

    static properties = {
        distanceToRun: { type: Number },
    };

    render() {
        return html`
            <header>
                <div>Horse Game</div>
                <button @click="${this.quitEvent}">Quit</button>
            </header>
            <div id="horserunFrame">
                <div id="horserun" class="horserun0"></div>
            </div>
            <div id="distanceTraveled">${this.totalDistanceTraveled}m</div>
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
            </div>
        `;
    }

    runOneStep() {
        if (!this.timer) {
            this.timer = Date.now();
        }
        // Animate horse
        const oldStep = this.horseRunStep % this.nbAnimationSteps;
        const newStep = ++this.horseRunStep % this.nbAnimationSteps;
        this.renderRoot
            ?.querySelector('#horserun')
            .classList.replace(`horserun${oldStep}`, `horserun${newStep}`);

        // Update traveled distance
        this.totalDistanceTraveled += this.distanceTraveledByStep;
        this.requestUpdate();

        // Switch to next step (left or right)
        this.nextStepHasToBeRight = !this.nextStepHasToBeRight;

        // If we arrived
        if (this.totalDistanceTraveled > this.distanceToRun) {
            this.finishEvent(Date.now() - this.timer);
        }
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
}
customElements.define('horse-game', HorseGame);
