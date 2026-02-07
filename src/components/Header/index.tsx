import { Box, Typography } from "@mui/material";
import React from "react";

export function Header() {
    return (
        <Box component="header" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
            <Typography variant="h6">Tech Fix</Typography>
            <Typography variant="h6">User</Typography>
        </Box>
    );
}