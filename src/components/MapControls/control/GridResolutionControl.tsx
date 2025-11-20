import React from "react";
import {Box, Button} from "@mui/material";
import {MapControlHeader} from "../../util";

export const GridResolutionControl: React.FC<{
    gridResolution: number;
    setGridResolution: (value: number) => void;
}> = ({ gridResolution, setGridResolution }) => (
    <>
        <MapControlHeader title={"Grid resolution"}/>
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
            <p>{gridResolution}</p>
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