import { Box } from "@mui/material"

export const NoService = () => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <img style={{ width: "550px", height: "100%", borderRadius: "10px" }} src="/no_service.png" alt="Nenhum serviço encontrado" />
        </Box>
    )
}