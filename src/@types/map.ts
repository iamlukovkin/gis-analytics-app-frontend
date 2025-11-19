import * as mapSdk from "@maptiler/sdk";
import type {FeatureCollection} from "geojson";

export type ColorRampKey = keyof typeof mapSdk.ColorRampCollection;

export type RegionDto = {
    name: string,
    adminLevel: number,
    geoJsonDto: string
};

export type Region = {
    name: string,
    adminLevel: number,
    geoJson: FeatureCollection
};