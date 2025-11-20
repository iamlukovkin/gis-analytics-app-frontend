import React, { useState, useEffect } from "react";
import type { Region } from "../../../@types";

export const UserRegionControl: React.FC<{
    regions: Region[],
    setRegion: (region: Region | null) => void,
}> = ({ regions, setRegion }) => {
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    useEffect(() => {
        queueMicrotask(() => {
            if (!regions.length) return;
            setSelectedRegion(regions[0]);
            setRegion(regions[0]);
        })
    }, [regions, setRegion]);

    const onSelectRegion = (selectedValue: string) => {
        const region = regions.find(r => r.adminLevel === Number(selectedValue));
        if (!region) return;
        setSelectedRegion(region);
        setRegion(region);
    };

    return (
        <div>
            <h3>Region</h3>
            <select value={selectedRegion ? selectedRegion.adminLevel : ""}
                    onChange={(e) => onSelectRegion(e.target.value)}>
                {regions.map(region => (
                    <option key={region.adminLevel} value={region.adminLevel}>
                        {region.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
