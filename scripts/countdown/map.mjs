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
        //sizePoint: { type: Number, attribute: 'size-point' },
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
        //this.showMarkers(this.continents);
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
            .data(users, (user) => console.log(user) || user.id);

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
        console.log('Map recieve update', documentUpdate);
        this.userMap.set(documentUpdate.uid, {
            id: documentUpdate.uid,
            photoUser: documentUpdate.base64,
            latitude: documentUpdate.latitude,
            longitude: documentUpdate.longitude,
        });
        this.showUsers([...this.userMap.values()]);
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
