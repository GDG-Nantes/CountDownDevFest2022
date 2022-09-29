import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class SubmarineGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 100;
    }

    static properties = {};
    static styles = [
        this.mixinStyles,
        css`
            .propeller-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }

            .propeller {
                width: min(60vw, 60vh);
                height: min(60vw, 60vh);

                background-color: var(--primary);
                -webkit-mask: url(./assets/submarine-game/propeller.svg)
                    no-repeat 50% 50%;
                mask: url(./assets/submarine-game/propeller.svg) no-repeat 50%
                    50%;
                -webkit-mask-size: cover;
                mask-size: cover;
                transform: rotate(var(--rotation, 0deg));
            }
        `,
    ];

    render() {
        return this.renderGameSkeleton(
            this.renderHeader(),
            this.renderInstruction(),
            this.renderGame()
        );
    }

    renderHeader() {
        return html`Submarine Game`;
    }

    renderInstruction() {
        return html`<img src="./assets/submarine-game/submarine.svg" />
            <div class="">
                Turn the propeller with your finger (don't throw it, keep in
                contact) 👆
            </div>`;
    }

    renderGame() {
        return html` <div class="propeller-wrapper">
            <i
                class="propeller"
                @touchmove="${(event) => this.touchMove(event)}"
                @touchend="${(event) => this.touchEnd(event)}"></i>
        </div>`;
    }

    touchMove(event) {
        event.preventDefault();
        if (!this.propellerElt) {
            this.propellerElt = this.renderRoot?.querySelector('.propeller');
            const rect = this.propellerElt.getBoundingClientRect();
            this.centerPoint = new DOMPoint(
                rect.x + rect.width / 2,
                rect.y + rect.height / 2
            );
        }

        if (event.targetTouches && event.targetTouches.length > 0) {
            const touchPoint = new DOMPoint(
                event.targetTouches[0].pageX,
                event.targetTouches[0].pageY
            );
            const angleDeg =
                (Math.atan2(
                    touchPoint.y - this.centerPoint.y,
                    touchPoint.x - this.centerPoint.x
                ) *
                    180) /
                Math.PI;

            if (!this.baseAngle) {
                const lastPropertyAngle =
                    this.propellerElt.style?.getPropertyValue('--rotation');
                this.baseAngle = angleDeg;
                if (lastPropertyAngle) {
                    this.baseAngle = +lastPropertyAngle.substr(
                        0,
                        lastPropertyAngle.length - 3
                    );
                }
                this.previousAngle = this.baseAngle;
            }
            const deltaAngle = angleDeg - this.baseAngle;
            this.propellerElt.style?.setProperty(
                '--rotation',
                `${deltaAngle}deg`
            );

            const delta = Math.abs(this.previousAngle - angleDeg);
            if (delta > 10) {
                this.previousAngle = angleDeg;
                this.runOneStep();
            }
        }
    }

    touchEnd(event) {
        this.baseAngle = undefined;
        this.previousAngle = undefined;
    }

    runOneStep() {
        this.startTimer();
        //TODO

        // Update traveled distance
        this.incrementDistance(this.distanceTraveledByStep);
    }
}
customElements.define('submarine-game', SubmarineGame);
