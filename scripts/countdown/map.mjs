import { LitElement, html, css } from 'lit';
import * as d3 from 'd3';
import * as L from 'leaflet';
import { LEAFLET_TOKEN } from '../../config/secrets.mjs';

export class WorldMap extends LitElement {
    static styles = css`
        #map {
            height: 180px;
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
            var map = L.map(mapElt).setView([51.505, -0.09], 13);
            L.tileLayer(
                'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
                {
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: LEAFLET_TOKEN,
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
        return html` <div id="map"></div> `;
    }
}
customElements.define('world-map', WorldMap);
