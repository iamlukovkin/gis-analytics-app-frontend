import React from "react";
import {Autocomplete, TextField} from "@mui/material";
import type {ColorRampKey} from "../../../@types";
import {autocompleteGlassStyles} from "../../../services/sharedStyles.ts";
import {MapControlHeader} from "../../util";

export const HeatmapColorControl: React.FC<{
    selectedColorRamp: ColorRampKey;
    colorOptions: ColorRampKey[];
    onSelectColorRamp: (color: ColorRampKey | null) => void;
}> = ({ selectedColorRamp, colorOptions, onSelectColorRamp }) => (
    <>
        <MapControlHeader title={"Heatmap color"}/>
        <Autocomplete
            options={colorOptions}
            getOptionLabel={(option) => option}
            value={selectedColorRamp}
            onChange={(_, value) => onSelectColorRamp(value)}
            sx={autocompleteGlassStyles}
            renderInput={(params) => <TextField {...params} label="" variant="outlined" size="small" />}
        />
    </>
);