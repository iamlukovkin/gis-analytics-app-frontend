import React from "react";
import {Box} from "@mui/material";
import {CategorySelector} from "../CategoriesSelection";
import type {Category, Property} from "../../../@types";

export const CategoryControl: React.FC<{
    onSelectCategory: (category: Category | null,
    onSelectProperties: (properties: Property[]) => void,
    ) => void;
}> = ({onSelectCategory, onSelectProperties }) => (
    <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
        <CategorySelector
            onSelectCategory={onSelectCategory}
            onSelectProperties={onSelectProperties}
        />
    </Box>
);