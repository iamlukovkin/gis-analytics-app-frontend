import React from "react";
import {Autocomplete, TextField, Typography} from "@mui/material";
import type {ColorRampKey} from "../../../@types";
import {autocompleteGlassStyles} from "../../../services/sharedStyles.ts";

export const HeatmapColorControl: React.FC<{
    selectedColorRamp: ColorRampKey;
    colorOptions: ColorRampKey[];
    onSelectColorRamp: (color: ColorRampKey | null) => void;
}> = ({ selectedColorRamp, colorOptions, onSelectColorRamp }) => (
    <>
        <Typography
            sx={{
                fontWeight: 700,
                color: "#fff",
                fontSize: "0.85rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)"
            }}
        >
            Heatmap Color
        </Typography>
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