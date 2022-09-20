import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

export class TrainGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 1000;
    }

    static properties = {};
    static styles = [
        this.mixinStyles,
        css`
            ol,
            ul {
                list-style: none;
            }

            blockquote,
            q {
                quotes: none;
            }

            blockquote:before,
            blockquote:after,
            q:before,
            q:after {
                content: '';
                content: none;
            }

            table {
                border-collapse: collapse;
                border-spacing: 0;
            }

            /*Background*/
            .background {
                position: absolute;
                top: 0px;
                width: 100%;
                height: 100%;
                background-color: #ddd;
                background: repeating-linear-gradient(
                    to right,
                    #ddd,
                    #ddd 40px,
                    #999 40px,
                    #999 50px
                );
            }

            .room {
                height: 100%;
                position: relative;
            }

            .floor {
                background-color: #362f2d;
                height: 30px;
                width: 100%;
                position: absolute;
                bottom: 0;
            }

            .train-game {
                position: relative;
                height: 100%;
                width: 100%;
            }

            /*Content*/
            .content {
                position: absolute;
                top: 0px;
                margin: 0 auto;
                width: 100%;
                overflow: hidden;
            }

            /*Fireplace*/
            .fireplace {
                background: url('https://res.cloudinary.com/dnkyeoud9/image/upload/v1450743321/fireplace_khwwvj.png')
                    no-repeat;
                background-size: 280px 200px;
                height: 200px;
                background-position: center top;
                margin: 0 auto;
                position: relative;
                text-align: center;
                overflow: hidden;
            }

            .wooden {
                position: absolute;
                width: 100%;
                margin: 0 auto;
                bottom: 50px;
                text-align: center;
            }

            .flames {
                position: absolute;
                bottom: -10px;
                width: 100%;
                margin: 0 auto;
            }
            .flames img:first-of-type {
                margin-right: -22px;
                animation: flicker 1.5s 300ms ease-in infinite alternate;
                -webkit-animation: flicker 1.5s 300ms ease-in infinite alternate;
                -moz-animation: flicker 1.5s 300ms ease-in infinite alternate;
                -o-animation: flicker 1.5s 300ms ease-in infinite alternate;
            }
            .flames img:last-of-type {
                margin-left: -22px;
                animation: flicker 1s ease-in infinite alternate;
                -webkit-animation: flicker 1s ease-in infinite alternate;
                -moz-animation: flicker 1s ease-in infinite alternate;
                -o-animation: flicker 1s ease-in infinite alternate;
            }

            /*Flame animation*/
            @keyframes flicker {
                0% {
                    transform: rotate(-3deg);
                }
                20% {
                    transform: rotate(3deg);
                }
                40% {
                    transform: rotate(-3deg);
                }
                60% {
                    transform: rotate(3deg) scaleY(1.02);
                }
                80% {
                    transform: rotate(-3deg) scaleY(0.96);
                }
                100% {
                    transform: rotate(3deg);
                }
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
        return html`Train Game`;
    }

    renderInstruction() {
        return html`<img src="./assets/train-game/train.svg" />
            <div class="">Throw wood in the fire</div>`;
    }

    renderGame() {
        return html` <div class="train-game">
            <div class="background">
                <div class="floor"></div>

                <div class="room"></div>
            </div>

            <div class="content">
                <div class="fireplace">
                    <div class="flames">
                        <img
                            src="https://res.cloudinary.com/dnkyeoud9/image/upload/v1450743321/flame1_aagay8.png" />
                        <img
                            src="https://res.cloudinary.com/dnkyeoud9/image/upload/v1450743321/flame2_lcvcdn.png" />
                    </div>
                </div>
            </div>

            <div class="wooden">
                <img
                    src="./assets/train-game/buche.png"
                    @touchmove="${(event) => this.touchMove(event)}"
                    @touchend="${(event) => this.touchEnd(event)}" />
            </div>
        </div>`;
    }

    touchMove(event) {
        if (!this.woodenElt) {
            this.woodenElt = this.renderRoot?.querySelector('.wooden img');
        }

        if (event.targetTouches && event.targetTouches.length > 0) {
            this.woodenElt.style.position = 'fixed';
            this.woodenElt.style.top = `${
                event.targetTouches[0].pageY - 73 / 2
            }px`;
            this.woodenElt.style.left = `${
                event.targetTouches[0].pageX - 121 / 2
            }px`;
        }
    }

    touchEnd(event) {
        const content = this.renderRoot?.querySelector('.content');
        const rect = content.getBoundingClientRect();
        const woodenRect = this.woodenElt.getBoundingClientRect();
        if (
            woodenRect.x + 121 / 2 >= rect.x && //
            woodenRect.x + 121 / 2 <= rect.x + rect.width && //
            woodenRect.y + 73 / 2 >= rect.y && //
            woodenRect.y + 73 / 2 <= rect.y + rect.height //
        ) {
            this.runOneStep();
        }
        this.woodenElt.style.position = 'relative';
        this.woodenElt.style.top = `initial`;
        this.woodenElt.style.left = `initial`;
    }

    runOneStep() {
        this.startTimer();
        this.incrementDistance(this.distanceTraveledByStep);
    }
}
customElements.define('train-game', TrainGame);
