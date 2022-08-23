import { LitElement, html, css } from 'lit';
import { WorldMap } from './map.mjs';

export class CountDown extends LitElement {
    static styles = css`
        :host {
            position: absolute;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            top: 0;
            left: 0;
            display: grid;
            grid-template-rows: 10px 1fr;
            grid-template-columns: 1fr;
        }
    `;
    constructor() {
        super();
    }

    static properties = {
        continents: { type: Array },
        service: { type: Object },
    };

    render() {
        return html`
            <p>Hello from lit</p>
            <world-map
                zoom="3"
                .continents=${this.continents}
                .service=${this.service}></world-map>
        `;
    }
}
customElements.define('count-down', CountDown);
