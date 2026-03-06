import { Card, CardContent, Typography, Box, Chip, Divider } from "@mui/material";
import React from "react";

interface CardEquipmentProps {
  brand?: string;
  model?: string;
  parts?: string[];
}

export function CardEquipment({
  brand,
  model,
  parts = [],
}: CardEquipmentProps) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          {brand || "-"} {model ? `- ${model}` : "Sem Informações do Equipamento"}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Peças Utilizadas
          </Typography>

          {parts.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {parts.map((part, index) => (
                <Chip
                  key={index}
                  label={part}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhuma peça registrada
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
