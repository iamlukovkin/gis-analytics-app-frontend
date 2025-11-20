import * as mapSdk from "@maptiler/sdk";
import type {FeatureCollection} from "geojson";

export type ColorRampKey = keyof typeof mapSdk.ColorRampCollection;

export type Region = {
    name: string,
    adminLevel: number,
    geoJson: FeatureCollection
};

export type FeatureProperties = {
    name: string,
    property_value: string,
    property_name: string
}