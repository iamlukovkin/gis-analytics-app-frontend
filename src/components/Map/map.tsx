import {useEffect, useRef} from "react";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import cfg from '../../assets/ts/config.ts';

function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapSdk.Map>(null);
    const city = {lng: 39.741253, lat: 54.629393};
    const zoom = 12;
    mapSdk.config.apiKey = cfg.MAPTILER_API_KEY;

    useEffect(() => {
        if (mapContainerRef.current) {
            mapRef.current = new mapSdk.Map({
                container: mapContainerRef.current,
                style: mapSdk.MapStyle.STREETS,
                center: [city.lng, city.lat],
                zoom: zoom
            })
        }
    }, [city.lng, city.lat]);

    return (
        <div className="map-wrap">
            <div ref={mapContainerRef} className={"map"}/>
        </div>
    )
}

export default Map;