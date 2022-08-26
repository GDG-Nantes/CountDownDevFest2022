import { LitElement, html, css } from 'lit';

export class HorseGame extends LitElement {
    constructor() {
        super();
        this.horseRunStep = 0;
    }

    static styles = css`
        :host {
            position: relative;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 10vh 50vh 40vh;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #horserun {
            width: 60px;
            background: url('../../../assets/horse-game/horse-walk.png') no-repeat;
            display: inline-block;
        }
        #horserun.horserun0 {
            background-position: 0px;
        }
        #horserun.horserun1 {
            background-position: -60px;
        }
        #horserun.horserun2 {
            background-position: -120px;
        }
        #horserun.horserun3 {
            background-position: -180px;
        }
        #horserun.horserun4 {
            background-position: -240px;
        }
        #horserun.horserun5 {
            background-position: -300px;
        }
        #horserun.horserun6 {
            background-position: -360px;
        }
        #horserun.horserun7 {
            background-position: -420px;
        }
        #horseshoes {
            display: flex;
            justify-content: space-evenly;
            border: 1px solid red;
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
            <div id="horserun" class="horserun0">
            </div>
            <div id="horseshoes">
                <button @click="${() => this.leftHorseShoeClick()}">Gauche</button>
                <button @click="${() => this.rightHorseShoeClick()}">Droite</button>
            </div>
        `;
    }

    leftHorseShoeClick() {
        // TODO: handle left / right pace
    }

    rightHorseShoeClick() {
        console.log('Right!');
        const oldStep = this.horseRunStep % 8;
        const newStep = ++this.horseRunStep % 8;
        console.log('Right!', oldStep, newStep);
        this.renderRoot?.querySelector('#horserun').classList.replace(`horserun${oldStep}`, `horserun${newStep}`);
        console.log('New right => ', this.renderRoot?.querySelector('#horserun').classList);
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
