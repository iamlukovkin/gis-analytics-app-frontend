import {useCallback, useEffect, useRef, useState} from "react";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import cfg from '../../assets/ts/config.ts';
import {Box} from "@mui/material";
import type {Property, Category, ColorRampKey} from "../../@types";
import type {FeatureCollection} from "geojson";
import {getCurrentPropertyPoints} from "../../services";
import {setNewSource, generateGrid} from "../../services/";
import type {GeoJSONSource} from "@maptiler/sdk";
import {MapControls} from "../MapControls";

const emptyMapData: FeatureCollection = {type: "FeatureCollection", features: []}

export function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapSdk.Map | null>(null);
    const mapSourcesRef = useRef<Array<{ src: string, layer: string }>>([]);
    const [mapReady, setMapReady] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [mapData, setMapData] = useState<FeatureCollection>(emptyMapData);
    const [selectedColorRamp, setSelectedColorRamp]
        = useState<keyof typeof mapSdk.ColorRampCollection>(cfg.HEATMAP_COLOR);

    useEffect(() => {
        mapSdk.config.apiKey = cfg.MAPTILER_API_KEY;
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            if (!mapContainerRef.current) return;
            mapRef.current = new mapSdk.Map({
                container: mapContainerRef.current,
                style: cfg.MAP_STYLE,
                center: [cfg.INIT_CITY.lon, cfg.INIT_CITY.lat],
                zoom: cfg.MAP_ZOOM
            });
            setMapReady(true);
        })
    }, []);

    useEffect(() => {
        if (!mapReady) return;
        mapRef.current?.on("load", () => {
            const {heatmapLayerId: layerId, heatmapSourceId: srcId} = mapSdk.helpers.addHeatmap(mapRef.current!, {
                data: emptyMapData,
                colorRamp: mapSdk.ColorRampCollection[selectedColorRamp].scale(0, 30),
                opacity: 0.8,
            });
            mapSourcesRef.current = [{src: srcId, layer: layerId}];
        });
        generateGrid(8, cfg.INIT_CITY, 6).then(grid => {
            if (!grid) return;
            const map = mapRef.current as mapSdk.Map;
            if (!map) return;
            const sourceName: string = "h3-grid";
            if (!map.getSource(sourceName)) {
                map.addSource(sourceName, {type: "geojson", data: grid})
                map.addLayer({
                    id: sourceName + "-layer",
                    type: "line",
                    source: sourceName,
                    paint: {
                        "line-color": "#FFFFFF",
                        "line-width": 1,
                    }
                });
            } else {
                (map.getSource(sourceName) as GeoJSONSource).setData(grid);
            }
        });
    }, [mapReady, selectedColorRamp]);

    const onSelectCategory = (category: Category | null, property: Property | null) => {
        setSelectedCategory(category);
        setSelectedProperty(property);
    }

    const changeMapData = useCallback((data: FeatureCollection) => {
        setNewSource(mapSourcesRef.current.map(source => source.src), mapRef, data);
    }, []);

    const changeColorOfHeatMap = (color: keyof typeof mapSdk.ColorRampCollection | null | string) => {
        if (!color) return;
        const colorRamp = (color as keyof typeof mapSdk.ColorRampCollection);
        setSelectedColorRamp(colorRamp);
        const map = mapRef.current;
        if (!map) return;
        mapSourcesRef.current.forEach(({layer, src}) => {
            if (map.getLayer(layer)) map.removeLayer(layer);
            if (map.getSource(src)) map.removeSource(src);
        })
        const {heatmapLayerId: layerId, heatmapSourceId: srcId} = mapSdk.helpers.addHeatmap(map, {
            data: mapData,
            colorRamp: mapSdk.ColorRampCollection[colorRamp].scale(0, 30),
            opacity: 0.8,
        });
        mapSourcesRef.current = [{src: srcId, layer: layerId}];
    }

    useEffect(() => {
        if (!mapReady) return;
        changeMapData(mapData || emptyMapData);
    }, [changeMapData, mapData, mapReady]);

    useEffect(() => {
        if (!mapReady) return;
        queueMicrotask(() => {
            setMapData(emptyMapData);
            if (selectedCategory && selectedProperty) {
                const categoryName = selectedCategory.fullName;
                const propertyName = selectedProperty.fullName;
                getCurrentPropertyPoints(categoryName, propertyName, cfg.INIT_CITY.lat, cfg.INIT_CITY.lon)
                    .then(response => {
                        setMapData(response || emptyMapData);
                    })
                    .catch(console.error);
            }
        })
    }, [changeMapData, mapReady, selectedCategory, selectedProperty]);

    return (
        <Box sx={{display: "flex"}}>
            <MapControls
                selectedColorRamp={selectedColorRamp}
                onSelectCategory={onSelectCategory}
                onSelectColorRamp={(color) => changeColorOfHeatMap(color)}
                colorOptions={Object.keys(mapSdk.ColorRampCollection) as ColorRampKey[]}
            />
            <div className={"container"}>
                <div ref={mapContainerRef} id={"map"} className={"map"}/>
            </div>
        </Box>
    )
}
