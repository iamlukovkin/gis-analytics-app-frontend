import { Paper } from "@mui/material";
import React, {type ReactNode } from "react";

type MapControlsProps = { children?: ReactNode; };

export const MapControls: React.FC<MapControlsProps> = ({ children }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 20,
                p: 2,
                width: 240,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(14px) saturate(180%)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 10px 36px rgba(0,0,0,0.25)",
                },
            }}
        >
            {children}
        </Paper>
    );
};
