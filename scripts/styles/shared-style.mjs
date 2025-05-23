import { css } from 'lit';

export const buttonCss = css`
    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-sizing: border-box;
        outline: 0px;
        border: 0px;
        margin: 0px;
        cursor: pointer;
        user-select: none;
        vertical-align: middle;
        appearance: none;
        text-decoration: none;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.75;
        letter-spacing: 0.02857em;
        text-transform: uppercase;
        min-width: 64px;
        padding: 6px 16px;
        border-radius: 4px;
        color: rgb(255, 255, 255);
        background-color: var(--primary);
        box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px,
            rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;
    }

    @media (max-width: 325px) {
        button {
            padding: 6px 5px;
        }
    }
`;

export const ticketCss = css`
    :host {
        --bottom-card: initial;
        --top-card: initial;
        --left-card: initial;
        --right-card: initial;
        --witdh-card: 100px;
        --height-card: 300px;
    }

    .card-ticket {
        position: absolute;
        background-color: transparent;
        z-index: 999;
        bottom: var(--bottom-card);
        left: var(--left-card);
        top: var(--top-card);
        right: var(--right-card);
    }

    .card-ticket .ticket {
        align-items: center;
        background-color: var(--tertiary);
        border-color: var(--primary);
        border-spacing: 2px;
        border-style: dashed none;
        border-width: 2px;
        -webkit-clip-path: polygon(
            20px 0,
            0 20px,
            0 calc(100% - 20px),
            20px 100%,
            calc(100% - 20px) 100%,
            100% calc(100% - 20px),
            100% 20px,
            calc(100% - 20px) 0
        );
        clip-path: polygon(
            20px 0,
            0 20px,
            0 calc(100% - 20px),
            20px 100%,
            calc(100% - 20px) 100%,
            100% calc(100% - 20px),
            100% 20px,
            calc(100% - 20px) 0
        );
        color: var(--primary-dark);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        height: var(--height-card);
        justify-content: center;
        margin: auto;
        max-width: var(--witdh-card);
        position: relative;
        width: var(--witdh-card);
    }

    .card-ticket .ticket .ticket-wrapper:after,
    .card-ticket .ticket .ticket-wrapper:before,
    .card-ticket .ticket:after,
    .card-ticket .ticket:before {
        align-items: center;
        background-color: var(--primary-dark);
        border-radius: 0 0 18px 0;
        content: '';
        display: flex;
        height: 60px;
        justify-content: center;
        left: 0;
        margin: auto;
        position: absolute;
        right: 0;
        width: 60px;
        z-index: 2;
    }

    .card-ticket .ticket .ticket-wrapper:after,
    .card-ticket .ticket .ticket-wrapper:before {
        background-color: var(--primary);
        height: 66px;
        width: 72px;
        z-index: 1;
    }

    .card-ticket .ticket .ticket-wrapper:before,
    .card-ticket .ticket:before {
        top: 0;
    }

    .card-ticket .ticket .ticket-wrapper:after,
    .card-ticket .ticket:after {
        bottom: 0;
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .card-ticket .ticket:before {
        background-color: var(--primary-dark);
        background-image: url(/assets/images/chevron-stylise.png);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 75%;
    }

    .card-ticket .ticket:after {
        opacity: 0.3;
    }

    .card-ticket .ticket.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .card-ticket .ticket .ticket-wrapper {
        height: 100%;
        padding: 75px 10px;
    }

    .card-ticket .ticket .ticket-wrapper .ticket-body {
        align-items: center;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        text-align: center;
    }

    .card-ticket .ticket .ticket-wrapper .ticket-body .price {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: start;
        text-align: center;
    }

    .card-ticket .ticket .ticket-wrapper .ticket-body .price hr {
        border-bottom-width: 2px;
        border-color: var(--secondary);
        border-radius: 2px;
        width: 66px;
    }

    .card-ticket .ticket .ticket-wrapper .ticket-body .price h2 {
        color: var(--primary-dark);
        margin: 10px 0 5px;
    }

    .card-ticket .ticket .ticket-wrapper .ticket-body .description p {
        margin: 5px 0;
    }

    .card-ticket .ticket .ticket-wrapper .ticket-body .description .quantity {
        font-size: 80%;
        opacity: 0.75;
    }
`;

export const balloonCss = css`
    :host {
        --color-bg: #f1f1f0;
        --color-balloon: #66bb6a;
        --color-balloon-2: #5da960;
        --color-strings: #d9d9d9;
        --color-basket: #ceb89f;
        --size-balloon: 1rem;
        --progress-balloon: 0px;
        --top-balloon: 0px;
    }

    .progress {
        position: relative;
        background: var(--primary);
        width: 100vw;
        height: 25px;
    }

    .progress-bar {
        width: var(--progress-balloon);
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        background: var(--secondary);
        transition: width 0.2s ease;
    }

    .progress i {
        display: block;
        position: absolute;
        top: var(--top-balloon);
        left: var(--progress-balloon);
        height: var(--size-balloon);
        width: var(--size-balloon);
        -webkit-mask: var(--icon-src) no-repeat 50% 50%;
        mask: var(--icon-src) no-repeat 50% 50%;
        -webkit-mask-size: contain;
        mask-size: contain;
        background-color: white;
        transition: left 0.2s ease;
    }

    .progress img {
        display: block;
        position: absolute;
        top: var(--top-balloon);
        left: var(--progress-balloon);
        height: var(--size-balloon);
    }

    .balloon {
        display: block;
        position: absolute;
        top: var(--top-balloon);
        left: var(--progress-balloon);
        transform: translate(-50%, -50%);
        perspective-origin: 50% 100%;
        perspective: calc(var(--size-balloon) * 0.5);
    }
    .balloon > .envelope {
        position: relative;
        display: block;
        width: var(--size-balloon);
        height: var(--size-balloon);
        background-color: var(--color-balloon);
        border-radius: var(--size-balloon);
        perspective-origin: 50% 100%;
        perspective: calc(var(--size-balloon) * 0.5);
    }
    .balloon > .envelope::before,
    .balloon > .envelope::after {
        position: absolute;
        display: block;
        content: '';
    }
    .balloon > .envelope::after {
        top: 2%;
        left: 50%;
        width: 38%;
        height: 80%;
        background-color: var(--color-balloon-2);
        transform: translateX(-50%);
        border-radius: 50%;
    }
    .balloon > .envelope::before {
        top: 15%;
        width: calc(var(--size-balloon));
        height: calc(var(--size-balloon) * 2.2);
        border-radius: calc(var(--size-balloon) / 11);
        background: linear-gradient(
            to right,
            var(--color-balloon) 0%,
            var(--color-balloon) 35%,
            var(--color-balloon-2) 35%,
            var(--color-balloon-2) 65%,
            var(--color-balloon) 65%,
            var(--color-balloon) 100%
        );
        transform: translateZ(calc(var(--size-balloon) * -0.94)) rotateX(-58deg);
    }
    .balloon > .basket {
        position: absolute;
        top: 114%;
        left: 50%;
        display: block;
        width: calc(var(--size-balloon) / 5);
        height: calc(var(--size-balloon) / 10);
        background: linear-gradient(
            to right,
            var(--color-strings) 0%,
            var(--color-strings) 10%,
            var(--color-bg) 10%,
            var(--color-bg) 30%,
            var(--color-strings) 30%,
            var(--color-strings) 40%,
            var(--color-bg) 40%,
            var(--color-bg) 60%,
            var(--color-strings) 60%,
            var(--color-strings) 70%,
            var(--color-bg) 70%,
            var(--color-bg) 90%,
            var(--color-strings) 90%,
            var(--color-strings) 100%
        );
        border-radius: calc(var(--size-balloon) / 40);
        border-bottom: calc(var(--size-balloon) / 5.5) solid var(--color-basket);
        transform: translateX(-50%) rotateX(-20deg);
    }
`;

export const cloudCss = css`
    .cloud {
        width: 50px;
        height: 45px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        top: 40vh;
        left: -20%;
        animation-name: cloud;
        animation-duration: 70s;
        animation-iteration-count: infinite;
        animation-play-state: paused;
    }

    .cloud::before {
        content: '';
        width: 35px;
        height: 30px;
        background-color: #fff;
        margin-left: -20px;
        margin-top: 10px;
        display: block;
        border-radius: 50%;
    }

    .cloud::after {
        content: '';
        width: 20px;
        height: 20px;
        background-color: #fff;
        position: absolute;
        right: -10px;
        top: 17px;
        border-radius: 50%;
    }

    .cloud.a {
        top: 50vh;
        animation-duration: 55s;
        z-index: 3;
    }

    .cloud.b {
        top: 25vh;
        left: -15%;
        animation-duration: 38s;
        z-index: 8;
    }

    .cloud.c {
        top: 30vh;
        left: -10%;
        animation-duration: 25s;
        z-index: 4;
    }

    .wind {
        width: 150px;
        background-color: #eee;
        height: 2px;
        position: absolute;
        top: 35vh;
        animation-name: wind;
        animation-duration: 5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-play-state: paused;
        z-index: 1;
    }

    .wind::before {
        content: '';
        position: absolute;
        left: 200px;
        width: 100px;
        height: 1px;
        background-color: #eee;
        top: 100px;
    }

    .wind::after {
        content: '';
        position: absolute;
        left: 400px;
        width: 180px;
        height: 1px;
        background-color: #eee;
        top: 30px;
    }

    @keyframes cloud {
        0% {
            transform: translateX(140vw);
        }
        100% {
            transform: translateX(-30vw);
        }
    }

    @keyframes wind {
        0% {
            left: 100vw;
            opacity: 0;
        }
        15% {
            opacity: 1;
        }
        70% {
            left: -100vw;
            opacity: 1;
        }
        80% {
            left: -100vw;
            opacity: 0;
        }
        100% {
            left: 120vw;
            opacity: 0;
        }
    }

    .animation-paused {
        animation-play-state: paused;
    }

    .animation-running {
        animation-play-state: running;
    }
`;

export const landCss = css`
    :host {
        --sky-blue-color: #70c4c6;
    }
    .land {
        width: 100vw;
        height: 10vh;
        position: absolute;
        bottom: 0;
        background-color: #83a81c;
        z-index: 1;
    }
    .tree {
        width: 10px;
        height: 40px;
        background-color: #766257;
        left: 20vw;
        top: -4vh;
        position: absolute;

        animation-name: trees;
        animation-duration: 7s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    .tree::before {
        content: '';
        position: absolute;
        bottom: 125%;
        left: -7px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 20px 43px 20px;
        border-color: transparent transparent #bfde3b transparent;
        z-index: 1;
    }
    .tree::after {
        content: '';
        position: absolute;
        bottom: 100%;
        left: -25px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 30px 60px 30px;
        border-color: transparent transparent #93ae29 transparent;
    }
    .tree.a {
        transform: scale(0.5);
        top: -3vh;
        left: 30vw;
    }
    .tree.b {
        transform: scale(0.75);
        left: 46vw;
        top: -5vh;
    }
    .tree.c {
        transform: scale(1.5);
        left: 60vw;
        top: 3vh;
    }
    .tree.d {
        transform: scale(1.25);
        left: 70vw;
        top: 4vh;
    }

    @keyframes trees {
        0% {
            transform: translateX(88vw);
        }
        100% {
            transform: translateX(-80vw);
        }
    }

    .animation-paused {
        animation-play-state: paused;
    }

    .animation-running {
        animation-play-state: running;
    }
`;
