import React, {useCallback, useEffect, useState} from "react";
import {getCategoriesWithProperties} from "../../../services/categories.ts";
import type {Category, Property} from "../../../@types";
import {Autocomplete, TextField, Box, Typography} from "@mui/material";
import {autocompleteGlassStyles} from "../../../services/sharedStyles";

interface Props {
    onSelectCategory: (category: Category | null, property: Property | null) => void;
}

export const CategorySelector: React.FC<Props> = ({onSelectCategory}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    useEffect(() => {
        getCategoriesWithProperties().then(data => {
            setCategories(data);
            if (!data.length) return;
            const firstCategory = data[0];
            setSelectedCategory(firstCategory);
            setProperties(firstCategory.properties);
            if (firstCategory.properties.length) setSelectedProperty(firstCategory.properties[0]);
        });
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            if (!selectedCategory) {
                setProperties([]);
                setSelectedProperty(null);
                return;
            }
            const props = selectedCategory.properties;
            setProperties(props);
            if (props.length) setSelectedProperty(props[0]);
        });
    }, [selectedCategory]);

    const handleChangeProperty = useCallback((category: Category | null, property: Property | null) => {
        onSelectCategory(category, property);
    }, [onSelectCategory]);

    useEffect(() => {
        handleChangeProperty(selectedCategory, selectedProperty);
    }, [handleChangeProperty, selectedCategory, selectedProperty]);


    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
            <Typography sx={{
                fontWeight: 700,
                color: "#fff",
                fontSize: "0.85rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)"
            }}>
                Category
            </Typography>
            <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.fullName}
                value={selectedCategory}
                onChange={(_, value) => setSelectedCategory(value)}
                sx={autocompleteGlassStyles}
                renderInput={(params) => (
                    <TextField {...params} label="" variant="outlined" size="small" />
                )}
            />
            <Typography sx={{
                fontWeight: 700,
                color: "#fff",
                fontSize: "0.85rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)"
            }}>
                Property
            </Typography>
            <Autocomplete
                options={properties}
                getOptionLabel={(option) => option.fullName}
                value={selectedProperty}
                onChange={(_, value) => setSelectedProperty(value)}
                sx={autocompleteGlassStyles}
                renderInput={(params) => (
                    <TextField {...params} label="" variant="outlined" size="small" />
                )}
            />
        </Box>
    );
};
