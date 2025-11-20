import React from "react";
import {Autocomplete, TextField} from "@mui/material";
import type {Region} from "../../../@types";
import {autocompleteGlassStyles} from "../../../services/sharedStyles.ts";
import {MapControlHeader} from "../../util";

export const UserRegionControl: React.FC<{
    selectedRegion: Region | null,
    regions: Region[],
    setRegion: (region: Region | null) => void,
}> = ({selectedRegion, regions, setRegion}) => {
    return (
        <>
            <MapControlHeader title={"Region"}/>
            <Autocomplete
                options={regions}
                getOptionLabel={(option) => option.name}
                value={selectedRegion}
                onChange={(_, value) => setRegion(value)}
                sx={autocompleteGlassStyles}
                renderInput={(params) => (
                    <TextField {...params} label="" variant="outlined" size="small"/>
                )}
            />
        </>
    );
}