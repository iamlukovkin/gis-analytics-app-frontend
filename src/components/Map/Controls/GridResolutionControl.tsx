import React from "react";

export const GridResolutionControl: React.FC<{
    gridResolution: number;
    setGridResolution: (value: number) => void;
}> = ({ gridResolution, setGridResolution }) => (
    <div className="grid-resolution-control">
        <h3>Разрешение сетки</h3>
        <div className="controls">
            <button disabled={gridResolution <= 3} onClick={() => setGridResolution(gridResolution - 1)}>-</button>
            <p>{gridResolution}</p>
            <button disabled={gridResolution >= 10} onClick={() => setGridResolution(gridResolution + 1)}>+</button>
        </div>
    </div>
);
