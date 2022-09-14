import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class BaloonGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 1000;
    }

    static properties = {};
    static styles = [this.mixinStyles, css``];

    render() {
        return this.renderGameSkeleton(
            this.renderHeader(),
            this.renderInstruction(),
            this.renderGame()
        );
    }

    renderHeader() {
        return html`Baloon Game`;
    }

    renderInstruction() {
        return html`<img src="./assets/baloon-game/air-baloon.svg" />
            <div class="">Blow on your phone</div>`;
    }

    renderGame() {
        return html` <div>TODO</div>`;
    }

    runOneStep() {
        this.startTimer();
        //TODO

        // Update traveled distance
        this.incrementDistance(this.distanceTraveledByStep);
    }
}
customElements.define('baloon-game', BaloonGame);
