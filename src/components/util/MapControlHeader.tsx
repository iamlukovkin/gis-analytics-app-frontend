import React from "react";
import {Typography} from "@mui/material";

export const MapControlHeader: React.FC<{ title: string }> = ({ title }) => (
    <Typography
        variant="subtitle1"
        sx={{fontWeight: 700, color: "#fff", fontSize: "0.85rem", textShadow: "0 1px 2px rgba(0,0,0,0.4)"}}
    >
        {title}
    </Typography>
);