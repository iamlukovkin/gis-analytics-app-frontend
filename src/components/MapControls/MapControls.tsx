import React, {type ReactNode } from "react";

type MapControlsProps = { children?: ReactNode; };

export const MapControls: React.FC<MapControlsProps> = ({ children }) => {
    return (
        <div style={{maxWidth:240}}>
            {children}
        </div>
    );
};
