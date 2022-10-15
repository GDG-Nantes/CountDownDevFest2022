import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class SubmarineGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 300;
        this.finish = false;
    }

    static properties = {};
    static styles = [
        this.mixinStyles,
        css`
            :host {
                --size-balloon: 40px;
                --top-balloon: -8px;
                --icon-src: url('./assets/submarine-game/submarine.svg');
            }

            .propeller-wrapper {
                position: relative;
                background-image: linear-gradient(0deg, #182848, #2980b9);
            }

            .propeller-wrapper,
            .propeller-border {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }

            .ocean {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                overflow: hidden;
            }

            .propeller-border {
                position: absolute;
                top: 60%;
                margin-top: calc(-1 * min(75vw, 75vh) / 2);
                width: min(75vw, 75vh);
                height: min(75vw, 75vh);
                border-radius: min(75vw, 75vh);
                background: radial-gradient(
                    circle,
                    var(--secondary) 0,
                    var(--primary-dark) 63%,
                    var(--secondary) 64%,
                    var(--primary-dark) 68%,
                    var(--secondary) 100%
                );
            }
            /*.propeller-border::after {
                position: absolute;
                content: '';
                top: 0;
                left: 0;
                width: min(75vw, 75vh);
                height: min(75vw, 75vh);
                border-radius: min(75vw, 75vh);
                background: radial-gradient(
                    circle,
                    var(--secondary) 0%,
                    var(--secondary) min(35vh, 35vw),
                    var(--primary-dark) min(70vh, 70vw),
                    var(--secondary) min(70vh, 70vw),
                    var(--primary-dark) min(72vh, 72vw),
                    var(--secondary) min(75vh, 75vw)
                );
            }*/

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

            .bubble {
                width: 30px;
                height: 30px;
                border-radius: 100%;
                position: absolute;
                background-color: white;
                bottom: -30px;
                opacity: 0.2;
                animation: bubble 15s ease-in-out infinite,
                    sideWays 4s ease-in-out infinite alternate;
            }

            @keyframes bubble {
                0% {
                    transform: translateY(0%);
                    opacity: 0.06;
                }
                100% {
                    transform: translateY(-120vh);
                }
            }

            @keyframes sideWays {
                0% {
                    margin-left: 0px;
                }
                100% {
                    margin-left: 200px;
                }
            }

            .bubble--1 {
                left: 10%;
                animation-delay: 0.5s;
                animation-duration: 16s;
                opacity: 0.2;
            }

            .bubble--2 {
                width: 15px;
                height: 15px;
                left: 40%;
                animation-delay: 1s;
                animation-duration: 10s;
                opacity: 0.1;
            }

            .bubble--3 {
                width: 10px;
                height: 10px;
                left: 30%;
                animation-delay: 5s;
                animation-duration: 20s;
                opacity: 0.3;
            }

            .bubble--4 {
                width: 25px;
                height: 25px;
                left: 40%;
                animation-delay: 8s;
                animation-duration: 17s;
                opacity: 0.2;
            }

            .bubble--5 {
                width: 30px;
                height: 30px;
                left: 60%;
                animation-delay: 10s;
                animation-duration: 15s;
                opacity: 0.1;
            }

            .bubble--6 {
                width: 10px;
                height: 10px;
                left: 80%;
                animation-delay: 3s;
                animation-duration: 30s;
                opacity: 0.4;
            }

            .bubble--7 {
                width: 15px;
                height: 15px;
                left: 90%;
                animation-delay: -7s;
                animation-duration: 25s;
                opacity: 0.3;
            }

            .bubble--9 {
                width: 20px;
                height: 20px;
                left: 50%;
                bottom: 30px;
                animation-delay: -5s;
                animation-duration: 19s;
                opacity: 0.2;
            }

            .bubble--10 {
                width: 40px;
                height: 40px;
                left: 30%;
                bottom: 30px;
                animation-delay: -21s;
                animation-duration: 16s;
                opacity: 0.3;
            }

            .bubble--11 {
                width: 30px;
                height: 30px;
                left: 60%;
                bottom: 30px;
                animation-delay: -13.75s;
                animation-duration: 20s;
                opacity: 0.3;
            }

            .bubble--11 {
                width: 25px;
                height: 25px;
                left: 90%;
                bottom: 30px;
                animation-delay: -10.5s;
                animation-duration: 19s;
                opacity: 0.3;
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
        return html` <div class="">
            Turn the propeller (don't throw it, keep in contact) 👆
        </div>`;
    }

    renderGame() {
        return html` <div class="propeller-wrapper">
            <div class="ocean">
                <div class="bubble bubble--1"></div>
                <div class="bubble bubble--2"></div>
                <div class="bubble bubble--3"></div>
                <div class="bubble bubble--4"></div>
                <div class="bubble bubble--5"></div>
                <div class="bubble bubble--6"></div>
                <div class="bubble bubble--7"></div>
                <div class="bubble bubble--8"></div>
                <div class="bubble bubble--9"></div>
                <div class="bubble bubble--10"></div>
                <div class="bubble bubble--11"></div>
                <div class="bubble bubble--12"></div>
            </div>
            <div class="propeller-border">
                <i
                    class="propeller"
                    @touchmove="${(event) => this.touchMove(event)}"
                    @touchend="${(event) => this.touchEnd(event)}"></i>
            </div>
        </div>`;
    }

    touchMove(event) {
        event.preventDefault();
        if (this.finish) return;
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

    finishEvent(time) {
        super.finishEvent(time);
        this.finish = true;
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
