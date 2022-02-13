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

    constructor() {
        super();
    }

    firstUpdated() {
        console.log('firstUpdated');
        super.connectedCallback();
        const mapElt = this.renderRoot?.querySelector('#map') ?? null;
        console.log('map', mapElt);
        if (mapElt) {
            var map = L.map(mapElt).setView([51.505, -0.09], 3);
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
            ).addTo(map);

            // Add a svg layer to the map
            L.svg().addTo(map);

            const d3Map = d3.select(mapElt);
            console.log(d3Map);
        }
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
