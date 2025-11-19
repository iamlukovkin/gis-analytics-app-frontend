import React from "react";
import {Box} from "@mui/material";
import {CategorySelector} from "../CategoriesSelection";
import type {Category, Property} from "../../../@types";

export const CategoryControl: React.FC<{
    onSelectCategory: (
        category: Category | null,
        property: Property | null
    ) => void;
}> = ({onSelectCategory}) => (
    <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
        <CategorySelector onSelectCategory={onSelectCategory}/>
    </Box>
);