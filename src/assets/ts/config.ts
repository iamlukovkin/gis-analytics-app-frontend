import * as mapSdk from "@maptiler/sdk";


export type AppConfig = {
    MAPTILER_API_KEY: string,
    MAP_STYLE: mapSdk.ReferenceMapStyle | mapSdk.MapStyleVariant,
    BACKEND_URL: string,
    MAP_ZOOM: number,
    INIT_CITY: {
        lon: number,
        lat: number
    },
    HEATMAP_COLOR: keyof typeof mapSdk.ColorRampCollection
}

const config: AppConfig = {
    MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY as string,
    MAP_STYLE: mapSdk.MapStyle.STREETS.DARK,
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL as string,
    MAP_ZOOM: 12,
    INIT_CITY : {
        lon: 39.741253,
        lat: 54.629393
    },
    HEATMAP_COLOR: "COOL"
};

export default config;