import { LitElement, html } from 'lit';

export class BoatGame extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`
            <p>Boat Game</p>
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
customElements.define('boat-game', BoatGame);
