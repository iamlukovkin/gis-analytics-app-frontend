import React, { useEffect, useState } from "react";
import { getCategoriesWithProperties } from "../../../services/categories.ts";
import type { Category, Property } from "../../../@types";

interface Props {
    onSelectCategory: (category: Category | null) => void;
    onSelectProperties: (properties: Property[]) => void;
}

export const CategoriesControl: React.FC<Props> = ({ onSelectCategory, onSelectProperties }) => {
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
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "240px",
            padding: "12px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "8px",
            color: "#fff",
            fontFamily: "sans-serif"
        }}>
            {/* Category Selector */}
            <div>
                <label style={{ fontWeight: 700 }}>Category</label>
                <select
                    value={selectedCategory?.id || ""}
                    onChange={(e) => {
                        const cat = categories.find(c => c.id === Number(e.target.value)) || null;
                        setSelectedCategory(cat);
                    }}
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.ruName}</option>
                    ))}
                </select>
            </div>

            {/* Properties Selector */}
            <div>
                <label style={{ fontWeight: 700 }}>Properties</label>

                <div>
                    <button type="button" onClick={selectAll} style={{ flex: 1 }}>Выбрать все</button>
                    <button type="button" onClick={clearAll} style={{ flex: 1 }}>Очистить</button>
                </div>
                <div style={{maxHeight: "200px", overflowY: "auto",}}>
                    {properties.map((prop) => (
                        <label key={prop.id} style={{ display: "block", marginBottom: "4px", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={selectedProperties.includes(prop)}
                                onChange={() => toggleProperty(prop)}
                            />
                            {prop.fullName}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};
