import {useEffect, useRef} from "react";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import cfg from '../../assets/ts/config.ts';
import {Box} from "@mui/material";
import Navbar from "../Navbar/navbar.tsx";

function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapSdk.Map>(null);
    const city = {lng: 39.741253, lat: 54.629393};
    const zoom = 12;
    mapSdk.config.apiKey = cfg.MAPTILER_API_KEY;

    useEffect(() => {
        if (!mapContainerRef.current) return;
        mapRef.current = new mapSdk.Map({
            container: mapContainerRef.current,
            style: mapSdk.MapStyle.STREETS,
            center: [city.lng, city.lat],
            zoom: zoom
        })
    }, [city.lng, city.lat]);

    return (
        <Box sx={{display: "flex"}}>
            <Navbar/>
            <div className={"container"}>
                <div ref={mapContainerRef} id={"map"} className={"map"}/>
            </div>
        </Box>
    )
}

export default Map;