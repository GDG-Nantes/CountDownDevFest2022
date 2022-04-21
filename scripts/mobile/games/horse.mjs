import { LitElement, html } from 'lit';

export class HorseGame extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`
            <p>Horse Game</p>
            <world-map zoom="10" size-point="1"></world-map>
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
customElements.define('horse-game', HorseGame);
