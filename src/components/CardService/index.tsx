import { CardContent, Typography } from "@mui/material";
import { BoxTypeService, CardBox, TextClient } from "./styles.ts";

export const CardService = ({
  serviceType,
  clientName,
  createdAt,
}: {
  serviceType: string;
  clientName: string;
  createdAt: { toDate: () => Date };
  notificationDate: { toDate: () => Date } | null;
}) => {
  const serviceStyles: Record<string, { base: string; bg: string }> = {
    "Motor de Portão": {
      base: "#6b6b6b",
      bg: "rgba(107, 107, 107, 0.15)",
    },
    Câmera: {
      base: "#1e7f3b",
      bg: "rgba(91, 255, 106, 0.18)",
    },
    Arcondicionado: {
      base: "#1c6f85",
      bg: "rgba(91, 229, 255, 0.18)",
    },
    "Sistemas Solares": {
      base: "#2a3db8",
      bg: "rgba(71, 95, 255, 0.18)",
    },
  };

  const style = serviceStyles[serviceType] ?? serviceStyles["Câmera"];

  const serviceImage = (serviceType: string) => {
    switch (serviceType) {
      case "Motor de Portão":
        return "portao.png";
      case "Câmeras":
        return "camera.png";
      case "Arcondicionado":
        return "arcondicionado.jpg";
      case "Sistemas Solares":
        return "sistema_solar.jpg";
      default:
        return "default.png";
    }
  };

  return (
    <CardBox>
      <img src={serviceImage(serviceType)} alt="Imagem do serviço" />
      <CardContent sx={{ padding: "20px" }}>
        <BoxTypeService bg={style.bg} border={style.base} color={style.base}>
          <Typography>{serviceType}</Typography>
        </BoxTypeService>
        <TextClient>{clientName}</TextClient>
        <Typography variant="body2" sx={{ color: "#666", fontSize: "13px" }}>
          Foi feito em {createdAt.toDate().toLocaleDateString()}
        </Typography>
      </CardContent>
    </CardBox>
  );
};
