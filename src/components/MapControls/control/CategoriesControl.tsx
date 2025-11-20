import React, {useEffect, useState} from "react";
import {getCategoriesWithProperties} from "../../../services/categories.ts";
import type {Category, Property} from "../../../@types";

interface Props {
    onSelectCategory: (category: Category | null) => void;
    onSelectProperties: (properties: Property[]) => void;
}

export const CategoriesControl: React.FC<Props> = ({onSelectCategory, onSelectProperties}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

    useEffect(() => {
        getCategoriesWithProperties().then((data) => {
            setCategories(data);
            if (!data.length) return;
            const firstCategory = data[0];
            setSelectedCategory(firstCategory);
            setProperties(firstCategory.properties);
            setSelectedProperties(firstCategory.properties);
        });
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            if (!selectedCategory) {
                setProperties([]);
                setSelectedProperties([]);
                return;
            }
            setProperties(selectedCategory.properties);
            setSelectedProperties(selectedCategory.properties);
        })
    }, [selectedCategory]);

    useEffect(() => {
        onSelectCategory(selectedCategory);
    }, [selectedCategory, onSelectCategory]);

    useEffect(() => {
        onSelectProperties(selectedProperties);
    }, [selectedProperties, onSelectProperties]);

    const toggleProperty = (prop: Property) => {
        setSelectedProperties((prev) =>
            prev.includes(prop)
                ? prev.filter((p) => p !== prop)
                : [...prev, prop]
        );
    };

    const selectAll = () => setSelectedProperties([...properties]);
    const clearAll = () => setSelectedProperties([]);

    return (
        <div>
            <div>
                <h3>Category</h3>
                <select value={selectedCategory?.id || ""}
                    onChange={(e) => {
                        const cat = categories.find(c => c.id === Number(e.target.value)) || null;
                        setSelectedCategory(cat);
                    }}
                >
                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.ruName}</option>))}
                </select>
            </div>
            <div>
                <h3>Properties</h3>
                <div>
                    <button type="button" onClick={selectAll}>Выбрать все</button>
                    <button type="button" onClick={clearAll}>Очистить</button>
                </div>
                <div>
                    {properties.map((prop) => (
                        <label key={prop.id}>
                            <input type="checkbox" checked={selectedProperties.includes(prop)}
                                onChange={() => toggleProperty(prop)}/>
                            {prop.fullName}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};
