import { LitElement, html } from 'lit';
import { WorldMap } from './map.mjs';

export class CountDown extends LitElement {
    constructor() {
        super();
    }

    static properties = {
        continents: { type: Array },
    };

    render() {
        return html`
            <p>Hello from lit</p>
            <world-map
                zoom="3"
                size-point=".1"
                .continents=${this.continents}></world-map>
        `;
    }
}
customElements.define('count-down', CountDown);
