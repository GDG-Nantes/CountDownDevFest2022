import { LitElement, html, css } from 'lit';
import { GameMixin } from './game-mixin.mjs';

const State = {
    IDLE: 1,
    RECV: 2,
};
export class BaloonGame extends GameMixin(LitElement) {
    constructor() {
        super();
        this.distanceTraveledByStep = 500;
        this.blowStarted = false;

        /**
         * Params linked to audio Frequency Engine
         */

        this.audioContext = new AudioContext();
        this.state = State.IDLE; // state
        this.isRunning = false; // Listening is running
        this.iteration = 0; // Iteration of frequency analysis (to check every 5 seconds)
        this.peakThreshold = -65; //
        this.minRunLength = 2;
        this.freqMin = 0; // Mininum Frequency to watch
        this.freqMax = 29500; // Maximum Frequency to watch

        this.iterationThreadshold = 40;
        this.iterationOverThreshold = 0;
        this.gameSoundThreshold = 190;
    }

    static properties = {};
    static styles = [
        this.mixinStyles,
        css`
            .main-balloon {
                position: relative;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 100px;
                width: 100%;
                height: 100%;
                --size-balloon: 15rem;
                --progress-balloon: calc(100vw - 50%);
            }

            .balloon-wrapper {
                position: relative;
            }

            .main-balloon .balloon {
                top: initial;
                --bottom-balloon: -70px;
                bottom: var(--bottom-balloon);
            }

            .line-limit::before {
                position: absolute;
                content: 'line to pass for a valid blow';
                font-size: 1.5rem;
                top: -1.5rem;
            }

            .line-limit {
                position: relative;
                border-top: thin dotted black;
                text-align: center;
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            .blow-instruction {
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 2rem;
                display: flex;
                align-items: center;
                align-content: center;
                justify-content: center;
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
        return html`Baloon Game`;
    }

    renderInstruction() {
        return html`<img src="./assets/baloon-game/air-baloon.svg" />
            <div class="">Blow on your phone 🌬</div>`;
    }
    disconnectedCallback() {
        this.stop();
    }

    renderGame() {
        return html`
            ${this.blowStarted
                ? this.renderGameArea()
                : html`<div
                      class="blow-instruction"
                      @click="${() => this.startBlow()}">
                      Click to Start Blowing
                  </div>`}
        `;
    }

    renderGameArea() {
        return html`
            <div class="main-balloon">
                <div class="balloon-wrapper">
                    <div class="balloon">
                        <div class="envelope"></div>
                        <div class="basket"></div>
                    </div>
                </div>
                <div class="line-limit"></div>
            </div>
        `;
    }

    displayBalloon(freq) {
        if (!this.balloonElt) {
            this.balloonElt = this.renderRoot?.querySelector(
                '.main-balloon .balloon'
            );
        }

        const bottom = freq - this.gameSoundThreshold;

        this.balloonElt.style?.setProperty('--bottom-balloon', `${bottom}px`);
    }

    runOneStep() {
        this.startTimer();

        // Update traveled distance
        this.incrementDistance(this.distanceTraveledByStep);
    }

    finishEvent(time) {
        super.finishEvent(time);
        console.log('Override Finish');
        this.stop();
    }

    /**
     * Audio frequency Engine
     */

    stop() {
        this.isRunning = false;
        const tracks = this.stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
    }

    startBlow() {
        this.blowStarted = true;
        this.requestUpdate();
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then((stream) => {
                try {
                    this.stream = stream;
                    /* use the stream */
                    const input =
                        this.audioContext.createMediaStreamSource(stream);
                    this.analyser = this.audioContext.createAnalyser();
                    input.connect(this.analyser);

                    this.analyser.fftSize = 256;
                    this.bufferLength = this.analyser.frequencyBinCount;
                    console.log(this.bufferLength);
                    this.dataArray = new Uint8Array(this.bufferLength);
                    this.isRunning = true;
                    requestAnimationFrame(this.customRaf.bind(this));
                } catch (err) {
                    console.error(err);
                }
            })
            .catch((err) => {
                /* handle the error */
            });
    }

    customRaf() {
        this.analyser.getByteFrequencyData(this.dataArray);
        //const displayFreq = [];
        let max = -Infinity;
        let overThreashold = true;
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            const barHeight = this.dataArray[i] / 2 + 100;
            sum += barHeight;
        }
        max = sum / 4;
        /*for (let i = 0; i < this.bufferLength; i++) {
            const barHeight = this.dataArray[i] / 2 + 100;
            if (barHeight > max) {
                max = barHeight;
            }
            //displayFreq.push(barHeight + 100);
            //canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            //canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

            //x += barWidth + 1;
        }*/
        if (max > this.gameSoundThreshold) {
            //if (overThreashold) {
            this.iterationOverThreshold++;
        } else {
            this.iterationOverThreshold = 0;
        }
        this.displayBalloon(max);
        if (this.iterationOverThreshold > this.iterationThreadshold) {
            this.runOneStep(max);
            console.log('Exceed', max, this.iterationOverThreshold);
        }
        console.log(max, this.iterationOverThreshold);
        if (this.isRunning) {
            requestAnimationFrame(this.customRaf.bind(this));
        }
    }
}
customElements.define('baloon-game', BaloonGame);
