import { LitElement, html } from 'lit';

export class BaloonGame extends LitElement {
    constructor() {
        super();
    }

    static properties = {};

    render() {
        return html`
            <p>Baloon Game</p>
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
customElements.define('baloon-game', BaloonGame);
