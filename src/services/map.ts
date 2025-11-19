import type {Feature, FeatureCollection, Polygon} from "geojson";
import {GeoJSONSource, type Map} from "@maptiler/sdk";
import type {RefObject} from "react";
import cfg from "../assets/ts/config.ts";
import * as h3 from "h3-js";

export function setNewSource(
    mapSources: Array<string>,
    mapRef: RefObject<Map | null>,
    data: FeatureCollection
) {
    for (const srcId of mapSources) {
        const source = mapRef.current!.getSource(srcId);
        if (!source) continue;
        (source as GeoJSONSource).setData(data);
    }
}

export async function generateGrid(
    resolution: number = 7,
    coords: {lat: number, lon: number},
    scale: number
): Promise<FeatureCollection | null> {

    let url = `${cfg.BACKEND_URL}/osm/regions/of-user`;
    url += `?lat=${coords.lat}&lon=${coords.lon}&scale=${scale}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not fetch map response");
    const regionGeoJson: FeatureCollection = await response.json();
    const polygon: Polygon = regionGeoJson.features[0].geometry as Polygon;
    const hexagons = h3.polygonToCells(polygon.coordinates, resolution, true);
    const features: Feature<Polygon>[] = hexagons.map(hex => {
        const hexBoundary = h3.cellToBoundary(hex, true);
        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [hexBoundary.map(([lat, lng]) => [lat, lng])]
            },
            properties: { h3: hex }
        } as Feature<Polygon>;
    })
    return { type: "FeatureCollection", features }
}