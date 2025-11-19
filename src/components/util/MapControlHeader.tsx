import React from "react";
import {Typography} from "@mui/material";

export const MapControlHeader: React.FC<{ title: string }> = ({ title }) => (
    <Typography
        variant="subtitle1"
        sx={{
            fontWeight: 600,
            mb: 1,
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)"
        }}
    >
        {title}
    </Typography>
);