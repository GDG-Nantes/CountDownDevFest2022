import { LitElement, html } from 'lit';

export class SubmarineGame extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html`
            <p>Submarine Game</p>
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
customElements.define('submarine-game', SubmarineGame);
