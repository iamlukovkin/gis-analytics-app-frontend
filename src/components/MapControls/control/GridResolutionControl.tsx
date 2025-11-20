import React from "react";

export const GridResolutionControl: React.FC<{
    gridResolution: number;
    setGridResolution: (value: number) => void;
}> = ({ gridResolution, setGridResolution }) => (
    <div>
        <h3>Grid resolution</h3>
        <div>
            <button
                disabled={gridResolution <= 5}
                onClick={() => setGridResolution(gridResolution - 1)}
            >-</button>
            <p>{gridResolution}</p>
            <button
                onClick={() => setGridResolution(gridResolution + 1)}
                disabled={gridResolution >= 10}
            >+</button>
        </div>
    </div>
);