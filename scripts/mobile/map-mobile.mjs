import { LitElement, html, css } from 'lit';
import * as d3 from 'd3';
import * as L from 'leaflet';
import { LEAFLET_TOKEN } from '../../config/secrets.mjs';
import { csvParse } from 'd3';
import { calculateDistanceBetweenToPoints } from '../services/helpers.mjs';

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
        service: { type: Object },
    };

    constructor() {
        super();
        this.zoom = 10;
        this.sizePoint = 0.2;
        this.exceedMiddleEarth = false;
        this.destination = null;
        this.firstPassedToPositiveLongitude = false;
        this.currentMarkers = undefined;
    }

    firstUpdated() {
        this.dictionnaryGDGChapters = {};
        for (let continent of this.continents) {
            for (let chapter of continent.chapters) {
                chapter.continentID = continent.id;
                this.dictionnaryGDGChapters[chapter.id] = chapter;
            }
        }

        super.connectedCallback();

        this.initLeafletMap();
        const idGDGNantes = 669;
        let gdgNantes = undefined;
        for (let gdgTmp of this.continents[2].chapters) {
            if (gdgTmp.id === idGDGNantes) {
                gdgNantes = gdgTmp;
            }
        }

        gdgNantes.targetLongitude = gdgNantes.longitude;
        this.centerToPoint(this.service.getCurrentGDG() ?? gdgNantes);

        this.addDebugHelpers();
    }

    initLeafletMap() {
        this.mapElt = this.renderRoot?.querySelector('#map') ?? null;
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
    }

    addDebugHelpers() {
        document.addEventListener('keyup', (event) => {
            console.log('keyup', event);
            if (
                event.key === 'ArrowRight' &&
                this.currentMarkers &&
                this.currentMarkers.length > 1
            ) {
                const gdgToTarget =
                    this.dictionnaryGDGChapters[this.currentMarkers[1].id];
                this.centerToPoint(gdgToTarget);
            }
        });
    }

    drawMarkers(d3Map, markers) {
        d3Map.selectAll('.marker').remove();
        d3Map
            .selectAll('myPlaces')
            .data(markers)
            .enter()
            .append('svg:path')
            .attr('id', (d) => `m${d.id}`)
            .attr('style', 'pointer-events: auto;')
            .attr('class', 'marker')
            .attr(
                'd',
                'M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z'
            )
            .attr('fill', 'var(--secondary)')
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
    }

    drawLines(d3Map, dataLines) {
        d3Map
            .selectAll('.line')
            .data(dataLines, (d, i) => i)
            .exit()
            .remove()
            .data(dataLines)
            .enter()
            .append('path')
            .attr('id', (d) => `l${d[1].id}`)
            .attr('style', 'pointer-events: auto;')
            .attr('class', 'line')
            .attr('stroke-width', 3)
            .attr('stroke', 'var(--primary)')
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
    }

    centerToPoint(gdg) {
        // Update position on firebase
        this.service.updatePosition(gdg).then(() => console.log('good'));

        console.log(gdg);
        // Center the map to point
        this.map.setView([gdg.latitude, gdg.targetLongitude]);

        // Prepare data to displays
        const dataLines = [];
        const markers = [];
        markers.push({
            id: gdg.id,
            latitude: gdg.latitude,
            longitude: gdg.longitude,
            targetLongitude: gdg.targetLongitude,
            distance: 0,
        });
        for (let targetChapter of gdg.targetChapters) {
            const line = [];
            const distance = calculateDistanceBetweenToPoints(
                gdg,
                targetChapter.targetChapter
            );
            dataLines.push(line);
            this.reworkCoordinatesOfTarget(gdg, targetChapter.targetChapter);
            line.push(gdg);
            line.push({
                ...targetChapter.targetChapter,
                distance,
            });
            markers.push({
                id: targetChapter.targetChapter.id,
                latitude: targetChapter.targetChapter.latitude,
                longitude: targetChapter.targetChapter.longitude,
                targetLongitude: targetChapter.targetChapter.targetLongitude,
                distance,
            });
        }
        this.currentMarkers = markers;

        console.log('markers', markers);
        // Display Datas
        const d3Map = d3.select(this.mapElt).select('svg');

        this.drawLines(d3Map, dataLines);
        this.drawMarkers(d3Map, markers);

        this.addListeners(d3Map);
    }

    addListeners(d3Map) {
        // Add callback when moving on the map
        this.map.on('moveend', this.moveMapCallback.bind(this));

        // Add Line listners
        d3Map
            .selectAll('.line')
            .on('click', this.clickLineCallback.bind(this))
            .on('mouseover', function (d) {
                d3.select(this)
                    .attr('stroke-width', 7)
                    .attr('stroke', 'var(--primary-dark)');
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .attr('stroke-width', 3)
                    .attr('stroke', 'var(--primary)');
            });

        // Add Markers listeners
        d3Map
            .selectAll('path.marker')
            .on('click', this.clickMarkerCallback.bind(this))
            .on('mouseover', function (d) {
                d3.select(this).attr('fill', 'var(--primary)');
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('fill', 'var(--primary-dark)');
            });
    }

    /**
     * Called when moving the map
     * @param {*} event
     */
    moveMapCallback(event) {
        const d3Map = d3.select(this.mapElt).select('svg');
        d3Map.selectAll('path.marker').attr('transform', (d) => {
            let proj = this.map.latLngToLayerPoint([
                d.latitude,
                d.targetLongitude,
            ]);
            let x = proj.x;
            let y = proj.y;
            this.zoom = event.target._zoom;
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
    }

    clickLineCallback(event) {
        const gdgToTarget =
            this.dictionnaryGDGChapters[event.currentTarget.id.substring(1)];
        this.clickOnTargetGDG(gdgToTarget, event.currentTarget.__data__[1]);
    }

    clickMarkerCallback(event) {
        const gdgToTarget =
            this.dictionnaryGDGChapters[event.currentTarget.id.substring(1)];
        this.clickOnTargetGDG(gdgToTarget, event.currentTarget.__data__);
    }

    clickOnTargetGDG(gdgToTarget, data) {
        if (this.destination && this.destination.id === gdgToTarget.id) {
            if (
                this.firstPassedToPositiveLongitude &&
                !this.exceedMiddleEarth &&
                gdgToTarget.longitude < 0
            ) {
                this.exceedMiddleEarth = true;
            }
            console.log(this.firstPassedToPositiveLongitude, gdgToTarget);
            this.firstPassedToPositiveLongitude =
                this.firstPassedToPositiveLongitude ||
                gdgToTarget.longitude > 0;
            console.log(this.firstPassedToPositiveLongitude);
            this.centerToPoint(gdgToTarget);
            this.destination = null;
            this.requestUpdate();
        } else {
            this.destination = {
                ...gdgToTarget,
                distance: data.distance,
            };
            this.requestUpdate();
        }
    }

    reworkCoordinatesOfTarget(gdg, target) {
        if (gdg.longitude < 0 && this.firstPassedToPositiveLongitude) {
            gdg.targetLongitude = 180 + (180 + gdg.longitude);
        }
        if (target.longitude < 0 && this.firstPassedToPositiveLongitude) {
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
            if (gdg.longitude > 0 || !this.firstPassedToPositiveLongitude) {
                gdg.targetLongitude = gdg.longitude;
            }
            if (target.longitude > 0 || !this.firstPassedToPositiveLongitude) {
                target.targetLongitude = target.longitude;
            }
        }

        /*console.log(
            'reworkd coordinates',
            this.firstPassedToPositiveLongitude,
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
        );*/
    }

    render() {
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
                    ? `${this.destination.city} (${this.destination.country}) -> ${this.destination.distance} km`
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
