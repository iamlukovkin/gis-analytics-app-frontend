import React, {useEffect, useState} from "react";
import {getCategoriesWithProperties} from "../../services/categories.ts";
import type {Category, Property} from "../../@types";
import {Autocomplete, Box, TextField} from "@mui/material";

interface Props {
    onLayerChange: (layer: Category) => void;
    onFeatureChange: (feature: Property) => void;
}

export const CategorySelector: React.FC<Props> = ({
                                                      onLayerChange: onCategoryChange,
                                                      onFeatureChange: onPropertyChange
                                                  }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const handleCategoriesChange = (categoryId: number | null) => {
        const category = categories.find(c => c.id === categoryId);
        setSelectedCategory(category || null);
        setSelectedProperty(category || null);
        if (!category) return;
        onCategoryChange(category);
        if (category.properties.length > 0) {
            const property = category.properties[0];
            setSelectedProperty(property);
            onPropertyChange(property);
        } else {
            setSelectedProperty(null);
        }
    };

    const handlePropertyChange = (propertyId: number | null) => {
        if (!selectedCategory) return;
        const property = selectedCategory.properties.find(p => p.id === propertyId);
        setSelectedProperty(property || null);
        if (!property) return;
        onPropertyChange(property);
    };

    useEffect(() => {
        getCategoriesWithProperties().then(data => {
            setCategories(data);
            if (data.length === 0) return;
            const firstCategory = data[0];
            setSelectedCategory(firstCategory);
            onCategoryChange(firstCategory);
            if (firstCategory.properties.length === 0) return;
            const firstProperty = firstCategory.properties[0];
            setSelectedProperty(firstProperty);
            onPropertyChange(firstProperty);
        })
    }, [onCategoryChange, onPropertyChange]);

    return (
        <Box sx={{p: 2, display: "flex", flexDirection: "column", width: "240px", gap: 2}}>
            <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.fullName}
                value={selectedCategory}
                onChange={(_, value) => handleCategoriesChange(value ? value.id : null)}
                renderInput={(params) => (
                    <TextField {...params} label={"Category"} variant="outlined" size="small"/>
                )}
            />
            {selectedCategory && (<Autocomplete
                options={selectedCategory.properties}
                getOptionLabel={(option) => option.fullName}
                value={selectedProperty}
                onChange={(_, value) => handlePropertyChange(value ? value.id : null)}
                renderInput={(params) => (
                    <TextField {...params} label={"Property"} variant="outlined" size="small"/>
                )}
            />)}
        </Box>
    );
}