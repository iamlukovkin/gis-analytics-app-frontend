import React from "react";
import type { ColorRampKey } from "../../../@types";

export const HeatmapColorControl: React.FC<{
    selectedColorRamp: ColorRampKey;
    colorOptions: ColorRampKey[];
    onSelectColorRamp: (color: ColorRampKey | null) => void;
}> = ({ selectedColorRamp, colorOptions, onSelectColorRamp }) => {
    if (!colorOptions.length) return null;
    return (
        <div>
            <h3>Heatmap color</h3>
            <select value={selectedColorRamp}
                onChange={(e) => onSelectColorRamp(e.target.value as ColorRampKey)}>
                {colorOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};
