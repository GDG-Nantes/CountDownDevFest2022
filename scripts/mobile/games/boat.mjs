import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class BoatGame extends GameMixin(LitElement) {
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
        return html`Boat Game`;
    }

    renderInstruction() {
        return html`<img src="./assets/boat-game/boat.svg" />
            <div class="">Turn the wheel</div>`;
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
customElements.define('boat-game', BoatGame);
