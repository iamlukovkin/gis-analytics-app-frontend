import React, {useCallback, useEffect, useState} from "react";
import {getCategoriesWithProperties} from "../../services/categories.ts";
import type {Category, Property} from "../../@types";
import {Autocomplete, Box, TextField} from "@mui/material";

interface Props {
    onSelectCategory: (category: Category | null, property: Property | null) => void;
}

export const CategorySelector: React.FC<Props> = ({onSelectCategory: onSelectCategory}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    useEffect(() => {
        getCategoriesWithProperties().then(data => {
            setCategories(data);
            if (data.length === 0) return;
            const firstCategory = data[0];
            setSelectedCategory(firstCategory);
            setProperties(firstCategory.properties)
            if (firstCategory.properties.length === 0) return;
            const firstProperty = firstCategory.properties[0];
            setSelectedProperty(firstProperty);
        })
    }, []);

    useEffect(() => {
        if (selectedCategory == null) {
            queueMicrotask(() => {
                setProperties([]);
                setSelectedProperty(null);
            });
            return;
        }
        queueMicrotask(() => {
            const properties = selectedCategory.properties;
            setProperties(properties);
            if (properties.length === 0) return;
            setSelectedProperty(properties[0]);
        })
    }, [selectedCategory]);

    const handleChangeProperty = useCallback((
        category: Category | null,
        property: Property | null
    ) => {
        onSelectCategory(category, property);
    }, [onSelectCategory]);

    useEffect(() => {
        handleChangeProperty(selectedCategory, selectedProperty);
    }, [handleChangeProperty, selectedCategory, selectedProperty]);

    return (
        <Box sx={{p: 2, display: "flex", flexDirection: "column", width: "240px", gap: 2}}>
            <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.fullName}
                value={selectedCategory}
                onChange={(_, value) => setSelectedCategory(value)}
                renderInput={(params) => (
                    <TextField {...params} label={"Category"} variant="outlined" size="small"/>
                )}
            />
            <Autocomplete
                options={properties}
                getOptionLabel={(option) => option.fullName}
                value={selectedProperty}
                onChange={(_, value) => setSelectedProperty(value)}
                renderInput={(params) => (
                    <TextField {...params} label={"Property"} variant="outlined" size="small"/>
                )}
            />
        </Box>
    );
}