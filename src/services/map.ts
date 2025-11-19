import type {FeatureCollection} from "geojson";
import {GeoJSONSource, type Map} from "@maptiler/sdk";
import type {RefObject} from "react";

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