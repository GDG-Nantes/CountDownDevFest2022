import { LitElement, html } from 'lit';

export class TrainGame extends LitElement {
    constructor() {
        super();
    }

    static properties = {
        continents: { type: Array },
    };

    render() {
        return html`
            <p>Train Game</p>
            <world-map
                zoom="10"
                size-point="1"
                .continents=${this.continents}></world-map>
            <button @click="${this.quitEvent}">Quit</button>
        `;
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
customElements.define('train-game', TrainGame);
