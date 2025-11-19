import {useEffect, useRef, useState} from "react";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import cfg from '../../assets/ts/config.ts';
import {Box} from "@mui/material";
import type {Property, Category} from "../../@types";
import {CategorySelector} from "../CategoriesSelection";
// import type {FeatureCollection} from "geojson";
// import {getCurrentPropertyPoints} from "../../services";

// const fetchData = async (
//     category: string,
//     property: string
// ): Promise<FeatureCollection | undefined> => {
//     try {
//         return await getCurrentPropertyPoints(category, property, city.lat, city.lng);
//     } catch (err) {
//         console.error(err);
//     }
// };

const city = {lng: 39.741253, lat: 54.629393};

function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapSdk.Map | null>(null);
    const [mapReady, setMapReady] = useState<boolean>(false);
    const zoom = 12;
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    mapSdk.config.apiKey = cfg.MAPTILER_API_KEY;

    useEffect(() => {
        if (!mapContainerRef.current) return;
        mapRef.current = new mapSdk.Map({
            container: mapContainerRef.current,
            style: cfg.MAP_STYLE,
            center: [city.lng, city.lat],
            zoom: zoom
        });
        setMapReady(true);
    }, []);

    useEffect(() => {
        mapRef.current?.on("load", () => {
            mapSdk.helpers.addPoint(mapRef.current!, {data: {type: "FeatureCollection", features: []}});
        })
    }, [mapReady]);

    useEffect(() => {
        console.log(selectedCategory, selectedProperty);
    }, [selectedCategory, selectedProperty]);

    return (
        <Box sx={{display: "flex"}}>
            <CategorySelector onLayerChange={setSelectedCategory} onFeatureChange={setSelectedProperty}/>
            <div className={"container"}>
                <div ref={mapContainerRef} id={"map"} className={"map"}/>
            </div>
        </Box>
    )
}

export default Map;