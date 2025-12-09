import {useCallback, useEffect, useRef, useState} from "react";
import type {GeoJSONSource} from "@maptiler/sdk";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import config from '../../services/config.ts';
import type {Category, ColorRampKey, FeatureProperties, Property, Region} from "../../@types";
import type {FeatureCollection} from "geojson";
import {generateGrid, getColorRamp, getCurrentPropertyPoints, getUserRegions, setNewSource} from "../../services";
import {CategoriesControl, GridResolutionControl, HeatmapColorControl, UserRegionControl} from "./Controls"

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
        = useState<keyof typeof mapSdk.ColorRampCollection>(config.HEATMAP_COLOR);

    useEffect(() => {
        mapSdk.config.apiKey = config.MAPTILER_API_KEY;
        mapSdk.config.primaryLanguage = mapSdk.Language.RUSSIAN;
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
                style: config.MAP_STYLE,
                center: [config.INIT_CITY.lon, config.INIT_CITY.lat],
                zoom: config.MAP_ZOOM
            });
            setMapReady(true);
            getUserRegions(config.INIT_CITY)
                .then(response => setAllUserRegions(response))
                .catch(console.error);
        })
    }, []);

    useEffect(() => {
        if (!mapReady) return;
        mapRef.current?.on("load", () => {
            const {heatmapLayerId: layerId, heatmapSourceId: srcId} = mapSdk.helpers.addHeatmap(mapRef.current!, {
                data: emptyMapData,
                colorRamp: getColorRamp(selectedColorRamp),
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
            colorRamp: getColorRamp(colorRamp),
            opacity: 0.8,
        });
        mapSourcesRef.current = [{src: srcId, layer: layerId}];
    }

    const changeRegion = useCallback((region: Region | null) => {
        setRegion(region);
    }, [])

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
            features: mapData.features
                .filter(f => checkProps
                    .has((f.properties as FeatureProperties).property_value))
        });
    }, [mapData]);

    useEffect(() => {
        if (!mapReady) return;
        queueMicrotask(() => {
            setMapData(emptyMapData);
            if (!selectedCategory) return;
            const categoryName = selectedCategory.sourceArgument;
            const propIds = selectedCategory.properties.map(prop => prop.id);
            if (!region) throw Error("Region OSM id is undefined");
            getCurrentPropertyPoints(categoryName, propIds, region?.osmId)
                .then(response => {
                    setMapData(response || emptyMapData);
                })
                .catch(console.error);
        })
    }, [changeMapData, mapReady, region, selectedCategory]);

    const elements = document.getElementsByClassName(config.MUST_BE_DISABLE_CLASSNAME);
    for (const element of elements) (element as HTMLElement).style.display = 'none';

    return (
        <div className={'map-content-wrapper'}>
            <div className={'map-preferences'}>
                <div className={'map-controls'}>
                    <h2>Выбранные категории</h2>
                    <CategoriesControl onSelectCategory={onSelectCategory} onSelectProperties={onSelectProperties}/>
                </div>
                <div className={'map-controls'}>
                    <h2>Параметры отображения</h2>
                    <HeatmapColorControl
                        selectedColorRamp={selectedColorRamp}
                        colorOptions={Object.keys(mapSdk.ColorRampCollection) as ColorRampKey[]}
                        onSelectColorRamp={
                            (color) => changeColorOfHeatMap(color)
                        }/>
                    <GridResolutionControl
                        gridResolution={gridResolution}
                        setGridResolution={setGridResolution}/>
                    <UserRegionControl regions={allUserRegions} setRegion={changeRegion}/>
                </div>
            </div>
            <div className={"container"}>
                <div ref={mapContainerRef} id={"map"} className={"map"}/>
            </div>
        </div>
    )
}
