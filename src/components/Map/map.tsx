import {useCallback, useEffect, useRef, useState} from "react";
import type {GeoJSONSource} from "@maptiler/sdk";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import cfg from '../../assets/ts/config.ts';
import {Box, Divider, Typography} from "@mui/material";
import type {Category, ColorRampKey, FeatureProperties, Property, Region} from "../../@types";
import type {FeatureCollection} from "geojson";
import {generateGrid, getCurrentPropertyPoints, getUserRegions, setNewSource} from "../../services";
import {MapControls} from "../MapControls";
import {CategoriesControl, GridResolutionControl, HeatmapColorControl, UserRegionControl} from "../MapControls/control"

const emptyMapData: FeatureCollection = {type: "FeatureCollection", features: []}

export function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapSdk.Map | null>(null);
    const mapSourcesRef = useRef<Array<{ src: string, layer: string }>>([]);
    const [mapReady, setMapReady] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [mapData, setMapData] = useState<FeatureCollection>(emptyMapData);
    const [visibleData, setVisibleData] = useState<FeatureCollection>(emptyMapData);
    const [gridResolution, setGridResolution] = useState<number>(7);
    const [allUserRegions, setAllUserRegions] = useState<Array<Region>>([]);
    const [region, setRegion] = useState<Region | null>(null);
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
                logoPosition: 'bottom-right',
                navigationControl: false,
                scaleControl: false,
                geolocateControl: false,
                style: cfg.MAP_STYLE,
                center: [cfg.INIT_CITY.lon, cfg.INIT_CITY.lat],
                zoom: cfg.MAP_ZOOM
            });
            setMapReady(true);
            getUserRegions(cfg.INIT_CITY)
                .then(response => setAllUserRegions(response))
                .catch(console.error);
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
    }, [mapReady, selectedColorRamp]);

    useEffect(() => {
        if (allUserRegions.length === 0) return;
        queueMicrotask(() => {
            const region = allUserRegions[0];
            setRegion(region);
        })
    }, [allUserRegions]);

    useEffect(() => {
        if (!region) return;
        if (region.geoJson.features.length === 0) return;
        generateGrid(region.geoJson, gridResolution).then(grid => {
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
                    paint: {"line-color": "#FFFFFF", "line-width": 1,}
                });
            } else {
                (map.getSource(sourceName) as GeoJSONSource).setData(grid);
            }
        });
    }, [gridResolution, region]);

    const onSelectCategory = useCallback((category: Category | null) => {
        setSelectedCategory(category);
    }, []);

    const changeMapData = useCallback((data: FeatureCollection) => {
        setNewSource(mapSourcesRef.current.map(source => source.src), mapRef, data);
        console.log(data);
    }, []);

    const changeColorOfHeatMap = (
        color: keyof typeof mapSdk.ColorRampCollection | null | string
    ) => {
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

    const changeRegion = (region: Region | null) => {
        setRegion(region);
    }

    useEffect(() => {
        setVisibleData(mapData)
    }, [mapData]);

    useEffect(() => {
        if (!mapReady) return
        setNewSource(
            mapSourcesRef.current.map(source => source.src),
            mapRef, visibleData || emptyMapData);
    }, [visibleData, mapReady]);

    const onSelectProperties = useCallback((newProperties: Property[]) => {
        if (!mapData.features.length) return;
        const checkProps = new Set(newProperties.map(p => p.fullName));
        setVisibleData({
            ...mapData,
            features: mapData.features.filter(f => checkProps.has((f.properties as FeatureProperties).property_value))
        });
    }, [mapData]);

    useEffect(() => {
        if (!mapReady) return;
        queueMicrotask(() => {
            setMapData(emptyMapData);
            if (!selectedCategory) return;
            const categoryName = selectedCategory.sourceArgument;
            const propIds = selectedCategory.properties.map(prop => prop.id);
            getCurrentPropertyPoints(categoryName, propIds, cfg.INIT_CITY.lat, cfg.INIT_CITY.lon)
                .then(response => {
                    setMapData(response || emptyMapData);
                })
                .catch(console.error);
        })
    }, [changeMapData, mapReady, selectedCategory]);

    return (
        <Box sx={{display: "flex"}}>
            <MapControls>
                <Typography
                    variant="subtitle1"
                    sx={{fontWeight: 600, mb: 1, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.3)"}}>
                    Map Controls
                </Typography>
                <CategoriesControl
                    onSelectCategory={onSelectCategory}
                    onSelectProperties={onSelectProperties}/>
                <Divider sx={{my: 1, borderColor: "rgba(255,255,255,0.2)"}}/>
                <HeatmapColorControl
                    selectedColorRamp={selectedColorRamp}
                    colorOptions={Object.keys(mapSdk.ColorRampCollection) as ColorRampKey[]}
                    onSelectColorRamp={(color) => changeColorOfHeatMap(color)}/>
                <Box>
                    <GridResolutionControl gridResolution={gridResolution} setGridResolution={setGridResolution}/>
                    <UserRegionControl selectedRegion={region} regions={allUserRegions} setRegion={changeRegion}/>
                </Box>
            </MapControls>
            <div className={"container"}>
                <div ref={mapContainerRef} id={"map"} className={"map"}/>
            </div>
        </Box>
    )
}
