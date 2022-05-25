import { LitElement, html, css } from 'lit';
import * as d3 from 'd3';
import * as L from 'leaflet';
import { LEAFLET_TOKEN } from '../../config/secrets.mjs';

export class WorldMap extends LitElement {
    static styles = css`
        #map {
            height: 800px;
        }
    `;

    static properties = {
        zoom: { type: Number },
        sizePoint: { type: Number, attribute: 'size-point' },
        continents: { type: Array },
    };

    constructor() {
        super();
        this.zoom = 3;
        this.sizePoint = 0.25;
    }

    firstUpdated() {
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

            /*d3Map.selectAll("myCircles")
            .data(markers)
            .enter()
            .append("circle")
              .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).x })
              .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).y })
              .attr("r", 14)
              .style("fill", "red")
              .attr("stroke", "red")
              .attr("stroke-width", 3)
              .attr("fill-opacity", .4)*/

            //.on('mouseover', function(d){})
        }
        this.showMarkers(this.continents);
    }

    showMarkers(data) {
        const markers = [];
        for (let region of data) {
            for (let { latitude, longitude } of region.chapters) {
                markers.push({ latitude, longitude });
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
                return `translate(${x},${y}) scale(${this.sizePoint})`;
            });
    }

    render() {
        console.log('render');
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
