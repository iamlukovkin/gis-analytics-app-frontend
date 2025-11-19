import * as mapSdk from "@maptiler/sdk";


export type AppConfig = {
    MAPTILER_API_KEY: string,
    MAP_STYLE: mapSdk.ReferenceMapStyle | mapSdk.MapStyleVariant,
    BACKEND_URL: string;
}

const config: AppConfig = {
    MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY as string,
    MAP_STYLE: mapSdk.MapStyle.DATAVIZ.LIGHT,
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL as string,
};

export default config;