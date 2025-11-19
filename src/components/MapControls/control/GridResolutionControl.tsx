import React from "react";
import {Box, Button, Typography} from "@mui/material";

export const GridResolutionControl: React.FC<{
    gridResolution: number;
    setGridResolution: (value: number) => void;
}> = ({ gridResolution, setGridResolution }) => (
    <>
        <Typography
            sx={{
                fontWeight: 700,
                color: "#fff",
                fontSize: "0.85rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)"
            }}
        >
            Grid resolution
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
                variant="contained"
                size="small"
                onClick={() => setGridResolution(gridResolution - 1)}
                disabled={gridResolution <= 1}
                sx={{ minWidth: 32, px: 1, py: 0.5 }}
            >
                -
            </Button>

            <Typography sx={{ color: "#fff", width: 32, textAlign: "center" }}>
                {gridResolution}
            </Typography>

            <Button
                variant="contained"
                size="small"
                onClick={() => setGridResolution(gridResolution + 1)}
                sx={{ minWidth: 32, px: 1, py: 0.5 }}
            >
                +
            </Button>
        </Box>
    </>
);