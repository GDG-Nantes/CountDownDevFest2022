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

export class WorldMapMobile extends LitElement {
    static styles = css`
        :host {
            position: relative;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 50px 1fr 20px;
        }
        #map {
            height: 100%;
            position: relative;
        }
        #destination {
        }
    `;

    static properties = {
        zoom: { type: Number },
        //sizePoint: { type: Number, attribute: 'size-point' },
        continents: { type: Array },
    };

    constructor() {
        super();
        this.zoom = 10;
        this.sizePoint = 0.3;
        this.exceedMiddleEarth = false;
        this.destination = null;
    }

    firstUpdated() {
        this.dictionnaryGDGChapters = {};
        for (let continent of this.continents) {
            for (let chapter of continent.chapters) {
                chapter.continentID = continent.id;
                this.dictionnaryGDGChapters[chapter.id] = chapter;
            }
        }

        console.log('firstUpdated');
        super.connectedCallback();

        this.mapElt = this.renderRoot?.querySelector('#map') ?? null;
        console.log('map', this.mapElt);
        if (this.mapElt) {
            this.map = L.map(this.mapElt).setView([47.23, -1.57], +this.zoom);
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
        //this.showMarkers(this.continents);

        //setTimeout(() => {
        //}, 2000);
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

            d3Map.selectAll('path.line').attr(
                'd',
                d3
                    .line()
                    .x((d) => {
                        let proj = this.map.latLngToLayerPoint([
                            d.latitude,
                            d.targetLongitude,
                        ]);
                        return proj.x;
                    })
                    .y((d) => {
                        let proj = this.map.latLngToLayerPoint([
                            d.latitude,
                            d.targetLongitude,
                        ]);
                        return proj.y;
                    })
            );
        });
    }

    centerToPoint(gdg) {
        console.log(gdg);
        this.map.setView([gdg.latitude, gdg.targetLongitude]);

        const dataLines = [];
        const markers = [];
        markers.push({
            latitude: gdg.latitude,
            longitude: gdg.longitude,
            targetLongitude: gdg.targetLongitude,
        });
        for (let targetChapter of gdg.targetChapters) {
            const line = [];
            dataLines.push(line);
            this.reworkCoordinatesOfTarget(gdg, targetChapter.targetChapter);
            line.push(gdg);
            line.push(targetChapter.targetChapter);
            markers.push({
                latitude: targetChapter.targetChapter.latitude,
                longitude: targetChapter.targetChapter.longitude,
                targetLongitude: targetChapter.targetChapter.targetLongitude,
            });
        }

        const d3Map = d3.select(this.mapElt).select('svg');
        d3Map.selectAll('.marker').remove();
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
                    d.targetLongitude,
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
                    d.targetLongitude,
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
                    d.targetLongitude,
                ]);
                let x = proj.x;
                let y = proj.y;
                return `translate(${x},${y}) scale(${
                    this.sizePoint * event.target._zoom
                })`;
            });

            d3Map.selectAll('path.line').attr(
                'd',
                d3
                    .line()
                    .x((d) => {
                        let proj = this.map.latLngToLayerPoint([
                            d.latitude,
                            d.targetLongitude,
                        ]);
                        return proj.x;
                    })
                    .y((d) => {
                        let proj = this.map.latLngToLayerPoint([
                            d.latitude,
                            d.targetLongitude,
                        ]);
                        return proj.y;
                    })
            );
        });

        console.log(dataLines);
        //const d3Map = d3.select(this.mapElt).select('svg');
        d3Map
            .selectAll('.line')
            .data(dataLines, (d, i) => i)
            .exit()
            .remove()
            .data(dataLines)
            .enter()
            .append('path')
            .attr('id', (d) => d[1].id)
            .attr('style', 'pointer-events: auto;')
            .attr('class', 'line')
            .attr('stroke-width', (d) => 3)
            .attr('stroke', (d) => 'red')
            .attr(
                'd',
                d3
                    .line()
                    .x((d) => {
                        let proj = this.map.latLngToLayerPoint([
                            d.latitude,
                            d.targetLongitude,
                        ]);
                        return proj.x;
                    })
                    .y((d) => {
                        let proj = this.map.latLngToLayerPoint([
                            d.latitude,
                            d.targetLongitude,
                        ]);
                        return proj.y;
                    })
            );
        d3Map
            .selectAll('.line')
            .on('click', (d) => {
                console.log('click', d, this);
                const gdgToTarget =
                    this.dictionnaryGDGChapters[d.currentTarget.id];
                if (
                    this.destination &&
                    this.destination.id === gdgToTarget.id
                ) {
                    if (!this.exceedMiddleEarth && gdgToTarget.longitude < 0) {
                        this.exceedMiddleEarth = true;
                    }
                    this.centerToPoint(gdgToTarget);
                    this.destination = null;
                    this.requestUpdate();
                } else {
                    this.destination = gdgToTarget;
                    this.requestUpdate();
                }
            })
            .on('mouseover', function (d) {
                console.log('mouseover', this);
                d3.select(this).attr('stroke-width', 5);
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('stroke-width', 2);
            });
        //.attr('fill', 'none');
    }

    reworkCoordinatesOfTarget(gdg, target) {
        if (gdg.longitude < 0) {
            gdg.targetLongitude = 180 + (180 + gdg.longitude);
        }
        if (target.longitude < 0) {
            target.targetLongitude = 180 + (180 + target.longitude);
        }

        if (this.exceedMiddleEarth) {
            let gdgLongitudeAddition = 180;
            let targetLongitudeAddition = 180;
            if (
                gdg.continentID === ID_CONTINENT_EUROPE ||
                gdg.continentID === ID_CONTINENT_AFRICA
            ) {
                gdgLongitudeAddition = 360;
            }
            if (gdg.longitude > 0) {
                gdg.targetLongitude = gdgLongitudeAddition + gdg.longitude;
            }
            if (
                target.continentID === ID_CONTINENT_EUROPE ||
                target.continentID === ID_CONTINENT_AFRICA
            ) {
                targetLongitudeAddition = 360;
            }
            if (target.longitude > 0) {
                target.targetLongitude =
                    targetLongitudeAddition + target.longitude;
            }
        } else {
            if (gdg.longitude > 0) {
                gdg.targetLongitude = gdg.longitude;
            }
            if (target.longitude > 0) {
                target.targetLongitude = target.longitude;
            }
        }

        console.log(
            'reworkd coordinates',
            this.exceedMiddleEarth,
            gdg.city,
            '->',
            target.city,
            gdg.longitude,
            gdg.longitude > 0,
            gdg.longitude > 0 ? 360 + gdg.longitude : gdg.longitude,
            '->',
            gdg.targetLongitude,
            target.longitude,
            target.longitude > 0,
            target.longitude > 0 ? 360 + target.longitude : target.longitude,
            '->',
            target.targetLongitude
        );
    }

    render() {
        console.log('render');
        return html`
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                crossorigin="" />
            <div>Select your next destination</div>
            <div id="map"></div>
            <div id="destination">
                Destination:
                ${this.destination
                    ? `${this.destination.city} (${this.destination.country})`
                    : ''}
            </div>
        `;
    }
}
customElements.define('world-map-mobile', WorldMapMobile);

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
