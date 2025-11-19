import React from "react";
import {Autocomplete, Box, TextField} from "@mui/material";
import type {Category, Property} from "../../@types";
import {CategorySelector} from "./CategoriesSelection";
import type {ColorRampKey} from "../../@types";

type MapControlsProps = {
    selectedColorRamp: ColorRampKey;
    onSelectCategory: (category: Category | null, property: Property | null) => void;
    onSelectColorRamp: (color: ColorRampKey | null) => void;
    colorOptions: ColorRampKey[];
};

export const MapControls: React.FC<MapControlsProps> = ({
    selectedColorRamp,
    onSelectCategory,
    onSelectColorRamp,
    colorOptions
}) => {
    return (
        <Box sx={{p: 2, display: "flex", flexDirection: "column", width: "240px", gap: 2}}>
            <CategorySelector onSelectCategory={onSelectCategory}/>
            <Autocomplete
                options={colorOptions}
                getOptionLabel={(option) => option}
                value={selectedColorRamp}
                onChange={(_, value) => onSelectColorRamp(value)}
                renderInput={(params) => (
                    <TextField {...params} label={"Colors"} variant="outlined" size="small"/>
                )}
            />
        </Box>
    );
};
