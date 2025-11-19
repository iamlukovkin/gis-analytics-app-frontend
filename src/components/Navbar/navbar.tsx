import type {FC} from "react";
import {Toolbar, Typography} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

const Navbar: FC = () => {
    return (
        <MuiAppBar position="fixed" sx={{ p: 0 }}>
            <Toolbar>
                <Typography variant="h6" color="inherit" component="div">
                    GIS Analytics app
                </Typography>
            </Toolbar>
        </MuiAppBar>
    );
};

export default Navbar;
