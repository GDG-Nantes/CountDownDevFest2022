import { LitElement, html, css } from 'lit';
import * as d3 from 'd3';
import * as L from 'leaflet';
import { LEAFLET_TOKEN } from '../../config/secrets.mjs';
import { csvParse } from 'd3';

const ID_CONTINENT_AFRICA = 1;
const ID_CONTINENT_EUROPE = 2;
const ID_CONTINENT_ASIA = 3;
const ID_CONTINENT_SOUTH_AMERICA = 4;
const ID_CONTINENT_NORTH_AMERICA = 5;

const CIRCLE_RADIUS = 50;

export class WorldMap extends LitElement {
    static styles = css`
        :host {
            position: relative;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
        }
        #map {
            height: 100%;
            position: relative;
        }
    `;

    static properties = {
        zoom: { type: Number },
        continents: { type: Array },
        service: { type: Object },
    };

    constructor() {
        super();
        this.zoom = 3;
        this.sizePoint = 0.1; //0.1;
        this.userList = [];
        this.userMap = new Map();
    }

    prefTest() {
        const base64JF =
            'data:image/jpeg;base64,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';
        const fakeUsers = [];
        const NB_USERS = 500;

        const keysGDG = Object.keys(this.dictionnaryGDGChapters);
        function getGDG() {
            let tmpGDG = undefined;
            do {
                tmpGDG =
                    this.dictionnaryGDGChapters[
                        Math.round(Math.random() * keysGDG.length)
                    ];
            } while (!tmpGDG);
            return tmpGDG;
        }

        for (let i = 0; i < NB_USERS; i++) {
            const tmpGDG = getGDG.bind(this)();
            fakeUsers.push({
                base64: base64JF,
                finish: true,
                latitude: tmpGDG.latitude,
                longitude: tmpGDG.longitude,
                distance: Math.round(Math.random() * 10000),
                days: Math.round(Math.random() * 80),
                name: 'Very long user name user' + i,
                uid: 'uid' + i,
            });
        }

        const stopInterval = setInterval(() => {
            const fakeUser1 =
                fakeUsers[Math.round(Math.random() * fakeUsers.length)];
            const fakeUser2 =
                fakeUsers[Math.round(Math.random() * fakeUsers.length)];
            const gdgTmp1 = getGDG.bind(this)();
            const gdgTmp2 = getGDG.bind(this)();
            if (!fakeUser1 || !fakeUser2 || !gdgTmp1 || !gdgTmp2) {
                return;
            }
            fakeUser1.latitude = gdgTmp1.latitude;
            fakeUser1.longitude = gdgTmp1.longitude;
            this.updateCallback(fakeUser1);
            fakeUser2.latitude = gdgTmp2.latitude;
            fakeUser2.longitude = gdgTmp2.longitude;
            this.updateCallback(fakeUser2);
        }, 50);

        setTimeout(() => clearInterval(stopInterval), 30_000);
    }

    firstUpdated() {
        this.service.watchUpdatePositions(this.updateCallback.bind(this));
        this.dictionnaryGDGChapters = {};
        for (let continent of this.continents) {
            for (let chapter of continent.chapters) {
                chapter.continentID = continent.id;
                this.dictionnaryGDGChapters[chapter.id] = chapter;
            }
        }

        super.connectedCallback();

        this.mapElt = this.renderRoot?.querySelector('#map') ?? null;
        if (this.mapElt) {
            this.map = L.map(this.mapElt).setView(
                [47.23 + 50, -1.57],
                +this.zoom
            );
            L.tileLayer(
                'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',
                {
                    attribution:
                        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    subdomains: 'abcd',
                    minZoom: 1,
                    maxZoom: 20,
                    accessToken: LEAFLET_TOKEN,
                    ext: 'jpg',
                }
            ).addTo(this.map);

            // Add a svg layer to the map
            L.svg().addTo(this.map);
        }
        const gdg =
            this.continents[2].chapters[
                Math.round(Math.random() * this.continents[2].chapters.length)
            ];
        gdg.targetLongitude = gdg.longitude;
        this.centerToPoint(gdg);
        this.prepareSvg();

        // To un comment to challenge perfs
        /*setTimeout(() => {
            this.prefTest();
        }, 1000);*/
    }

    prepareSvg() {
        d3.select(this.mapElt)
            .select('svg')
            .append('defs')
            .append('clipPath')
            .attr('id', 'markerUserClipPath')
            .append('circle')
            .attr('cx', CIRCLE_RADIUS)
            .attr('cy', CIRCLE_RADIUS)
            .attr('r', CIRCLE_RADIUS - 10);
    }

    showUsers(users) {
        const d3Map = d3.select(this.mapElt).select('svg');
        const usersMarkers = d3Map
            .selectAll('image.users')
            .data(users, (user) => user.id);

        usersMarkers.exit().remove();

        usersMarkers
            .enter()
            .append('image')
            .attr('id', (d) => d.id)
            .attr('class', 'users')
            .attr('xlink:href', (d) => d.photoUser)
            .attr('transform', (d) => {
                let proj = this.map.latLngToLayerPoint([
                    d.latitude,
                    d.longitude,
                ]);
                let x = proj.x;
                let y = proj.y;
                return `translate(${x - CIRCLE_RADIUS / 4},${
                    y - CIRCLE_RADIUS / 4
                }) scale(${this.sizePoint * this.zoom})`;
            })
            .attr('clip-path', 'url(#markerUserClipPath)')
            .merge(usersMarkers)
            .transition()
            .attr('transform', (d) => {
                if (d) {
                    let proj = this.map.latLngToLayerPoint([
                        d.latitude,
                        d.longitude,
                    ]);
                    let x = proj.x;
                    let y = proj.y;
                    return `translate(${x - CIRCLE_RADIUS / 4},${
                        y - CIRCLE_RADIUS / 4
                    }) scale(${this.sizePoint * this.zoom})`;
                } else {
                    return;
                }
            });
    }

    transformUserMap() {}

    updateCallback(documentUpdate) {
        this.userMap.set(documentUpdate.uid, {
            id: documentUpdate.uid,
            photoUser: documentUpdate.base64,
            latitude: documentUpdate.latitude,
            longitude: documentUpdate.longitude,
            finish: documentUpdate.finish,
            distance: documentUpdate.distance,
            days: documentUpdate.days,
            name: documentUpdate.name,
        });
        const users = [...this.userMap.values()];
        this.showUsers(users);
        this.emitTopUsersEvent(users);
    }

    emitTopUsersEvent(users) {
        const filterUsers = users
            .filter((user) => user.finish)
            .sort((user1, user2) => {
                if (+user1.days !== +user2.days) {
                    return +user1.days - +user2.days;
                } else {
                    return +user1.distance - +user2.distance;
                }
            })
            .slice(0, 8);
        if (filterUsers.length > 0) {
            const event = new CustomEvent('topUsersEvent', {
                detail: { users: filterUsers },
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(event);
        }
    }

    showMarkers(data) {
        const markers = [];
        for (let region of data) {
            for (let {
                latitude,
                longitude,
                targetLongitude,
            } of region.chapters) {
                markers.push({ latitude, longitude, targetLongitude });
            }
        }

        const d3Map = d3.select(this.mapElt).select('svg');
        d3Map
            .selectAll('myPlaces')
            .data(markers)
            .enter()
            .append('svg:path')
            .attr('class', 'marker')
            .attr(
                'd',
                'M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z'
            )
            .attr('transform', (d) => {
                let proj = this.map.latLngToLayerPoint([
                    d.latitude,
                    d.longitude,
                ]);
                let x = proj.x;
                let y = proj.y;
                return 'translate(' + x + ',' + y + ') scale(0)';
            })
            .transition()
            .delay(400)
            .duration(800)
            //.ease('elastic')
            .attr('transform', (d) => {
                let proj = this.map.latLngToLayerPoint([
                    d.latitude,
                    d.longitude,
                ]);
                let x = proj.x;
                let y = proj.y;
                return `translate(${x},${y}) scale(${
                    this.sizePoint * this.zoom
                })`;
            });

        this.map.on('moveend', (event) => {
            const d3Map = d3.select(this.mapElt).select('svg');
            d3Map.selectAll('path.marker').attr('transform', (d) => {
                let proj = this.map.latLngToLayerPoint([
                    d.latitude,
                    d.longitude,
                ]);
                let x = proj.x;
                let y = proj.y;
                return `translate(${x},${y}) scale(${
                    this.sizePoint * event.target._zoom
                })`;
            });
        });
    }

    centerToPoint(gdg) {
        this.map.setView([gdg.latitude, gdg.targetLongitude]);
    }

    render() {
        return html`
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                crossorigin="" />
            <div id="map"></div>
        `;
    }
}
customElements.define('world-map', WorldMap);

/**
 *
 *
 * submarine : https://thenounproject.com/icon/submarine-2393606/
 * boat : https://thenounproject.com/icon/boat-24055/
 * horses : https://thenounproject.com/icon/horse-2717676/
 * train : https://thenounproject.com/icon/train-39857/
 * train : https://thenounproject.com/icon/train-1067538/
 * baloon : https://thenounproject.com/icon/hot-air-balloon-2454934/
 * baloon : https://thenounproject.com/icon/hot-air-balloon-3928407/
 *
 *
 */
