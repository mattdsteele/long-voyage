import {GeoJSON} from 'geojson';
import slugify from 'slugify';
import circleToPolygon from 'circle-to-polygon';
const locations: [string, number, number][] = [
    ["Weeping Water",40.869963, -96.139978],
    ["Pacific Junction", 41.046265, -95.826994],
    ["Glenwood",41.050780, -95.744975],
    ["Treynor (Van)", 41.228629, -95.600611],
    ["Missouri Valley", 41.551377, -95.911499],
    ["Blair", 41.534263, -96.143052],
    ["Arlington", 41.451355, -96.356920],
    ["Valley", 41.315521, -96.343674],
    ["Valpariso", 41.080275, -96.832256],
    ["GW Checkpoint", 40.978586, -96.816119],
    ["Finish", 40.877370, -96.726704]
];

const geojson: GeoJSON = {
    type: "FeatureCollection",
    features: locations.map(location => {
        const [name, lat, lon] = location;
        const safeName = slugify(name, {remove: /[*+~.()'"!:@]/g})
        return {
            id: safeName,
            type: "Feature",
            properties: {
              name,
              id: safeName
            },
            geometry: circleToPolygon([lon, lat], 500)
        }
    })
}

console.log(JSON.stringify(geojson));