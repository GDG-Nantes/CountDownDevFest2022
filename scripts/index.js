import { LitElement, html } from 'lit';
import { CountDown } from './countdown/countdown';
import { Mobile } from './mobile/mobile';

class Main extends LitElement {
    constructor() {
        super();
    }

    /**
     *
     * @returns true if media queries detection as a width less than 600px
     */
    isMobile() {
        return !window.matchMedia('(min-width: 600px)').matches;
    }

    render() {
        return html`${this.isMobile()
            ? html`<count-down-mobile></count-down-mobile>`
            : html`<count-down></count-down>`} `;
    }
}
customElements.define('count-down-main', Main);
