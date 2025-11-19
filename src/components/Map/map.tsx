import {useCallback, useEffect, useRef, useState} from "react";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import cfg from '../../assets/ts/config.ts';
import {Box} from "@mui/material";
import type {Property, Category} from "../../@types";
import {CategorySelector} from "../CategoriesSelection";
import type {FeatureCollection} from "geojson";
import {getCurrentPropertyPoints} from "../../services";
import {setNewSource} from "../../services/";

const emptyMapData: FeatureCollection = {type: "FeatureCollection", features: []}

function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapSdk.Map | null>(null);
    const mapSourcesRef = useRef<Array<string>>([]);
    const [mapReady, setMapReady] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    useEffect(() => {
        mapSdk.config.apiKey = cfg.MAPTILER_API_KEY;
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            if (!mapContainerRef.current) return;
            mapRef.current = new mapSdk.Map({
                container: mapContainerRef.current,
                style: cfg.MAP_STYLE,
                center: [cfg.INIT_CITY.lng, cfg.INIT_CITY.lat],
                zoom: cfg.MAP_ZOOM
            });
            setMapReady(true);
        })
    }, []);

    useEffect(() => {
        if (!mapReady) return;
        mapRef.current?.on("load", () => {
            const {heatmapSourceId: srcId} = mapSdk.helpers.addHeatmap(
                mapRef.current!,
                {data: emptyMapData}
            );
            mapSourcesRef.current = [srcId];
        })
    }, [mapReady]);

    const onSelectCategory = (category: Category | null, property: Property | null) => {
        setSelectedCategory(category);
        setSelectedProperty(property);
    }

    const changeMapData = useCallback((data: FeatureCollection) => {
        setNewSource(mapSourcesRef.current, mapRef, data);
    }, []);

    useEffect(() => {
        if (!mapReady) return;
        changeMapData(emptyMapData);
        if (selectedCategory && selectedProperty) {
            getCurrentPropertyPoints(
                selectedCategory.fullName,
                selectedProperty.fullName,
                cfg.INIT_CITY.lat,
                cfg.INIT_CITY.lng
            )
                .then(response => {
                    changeMapData(response || emptyMapData);
                })
                .catch(console.error);
        }
    }, [changeMapData, mapReady, selectedCategory, selectedProperty]);

    return (
        <Box sx={{display: "flex"}}>
            <CategorySelector onSelectCategory={onSelectCategory}/>
            <div className={"container"}>
                <div ref={mapContainerRef} id={"map"} className={"map"}/>
            </div>
        </Box>
    )
}

export default Map;