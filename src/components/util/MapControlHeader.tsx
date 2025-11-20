import React from "react";
import {Typography} from "@mui/material";

export const MapControlHeader: React.FC<{ title: string }> = ({ title }) => (
    <Typography variant="subtitle1">{title}</Typography>
);