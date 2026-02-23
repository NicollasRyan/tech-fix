import { CardContent, Typography } from "@mui/material";
import { BoxTypeService, CardBox, TextClient } from "./styles.ts";
import {
  normalizeServiceType,
  SERVICE_TYPE_IMAGES,
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "../../constants/serviceTypes.ts";

export const CardService = ({
  serviceType,
  clientName,
  createdAt,
}: {
  serviceType: string;
  clientName: string;
  createdAt: { toDate: () => Date };
}) => {
  const normalizedType = normalizeServiceType(serviceType);

  const serviceStyles: Record<ServiceType, { base: string; bg: string }> = {
    motor_portao: {
      base: "#6b6b6b",
      bg: "rgba(107, 107, 107, 0.15)",
    },
    cameras: {
      base: "#1e7f3b",
      bg: "rgba(91, 255, 106, 0.18)",
    },
    ar_condicionado: {
      base: "#1c6f85",
      bg: "rgba(91, 229, 255, 0.18)",
    },
    sistema_solar: {
      base: "#2a3db8",
      bg: "rgba(71, 95, 255, 0.18)",
    },
  };

  const style = serviceStyles[normalizedType];
  const imageSrc = SERVICE_TYPE_IMAGES[normalizedType];
  const label = SERVICE_TYPE_LABELS[normalizedType];

  return (
    <CardBox>
      <img src={imageSrc} alt="Imagem do servico" />
      <CardContent sx={{ padding: "20px" }}>
        <BoxTypeService bg={style.bg} border={style.base} color={style.base}>
          <Typography>{label}</Typography>
        </BoxTypeService>
        <TextClient>{clientName}</TextClient>
        <Typography variant="body2" sx={{ color: "#666", fontSize: "13px" }}>
          Realizado:{" "}
          <span style={{ color: "red" }}>
            {createdAt.toDate().toLocaleDateString("pt-BR")}
          </span>
        </Typography>
      </CardContent>
    </CardBox>
  );
};
