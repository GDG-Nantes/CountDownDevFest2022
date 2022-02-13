import { LitElement, html } from 'lit';

export class Mobile extends LitElement {
    constructor() {
        super();
    }

    render() {
        return html` <p>Hello from mobile</p> `;
    }
}
customElements.define('count-down-mobile', Mobile);
