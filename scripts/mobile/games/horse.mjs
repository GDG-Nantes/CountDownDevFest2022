import { LitElement, html, css } from 'lit';

export class HorseGame extends LitElement {
    constructor() {
        super();
        this.horseRunStep = 0;
        this.nbAnimationSteps = 6;
        this.distanceTraveledByStep = 50;
        this.totalDistanceTraveled = 0;
        this.nextStepHasToBeRight = true;
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
            background: url('../../../assets/horse-game/horse-run.png') no-repeat;
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
            display: flex;
            justify-content: space-evenly;
        }
        #horseshoes button {
            width: 30vw;
            height: 30vh; 
        }
    `;

    static properties = {};

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
                <button @click="${() => this.leftHorseShoeClick()}">Gauche</button>
                <button @click="${() => this.rightHorseShoeClick()}">Droite</button>
            </div>
        `;
    }

    runOneStep() {
        // Animate horse
        const oldStep = this.horseRunStep % this.nbAnimationSteps;
        const newStep = ++this.horseRunStep % this.nbAnimationSteps;
        this.renderRoot?.querySelector('#horserun').classList.replace(`horserun${oldStep}`, `horserun${newStep}`);

        // Update traveled distance
        this.totalDistanceTraveled += this.distanceTraveledByStep;
        this.requestUpdate();

        // Switch to next step (left or right)
        this.nextStepHasToBeRight = !this.nextStepHasToBeRight;
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
        const event = new Event('exitGameEvent', {
            datas: { foo: 'test' },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
}
customElements.define('horse-game', HorseGame);
