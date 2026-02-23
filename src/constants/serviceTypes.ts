export const SERVICE_TYPES = [
  "ar_condicionado",
  "sistema_solar",
  "motor_portao",
  "cameras",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  ar_condicionado: "Ar-condicionado",
  sistema_solar: "Sistema Solar",
  motor_portao: "Motor de Portao",
  cameras: "Cameras",
};

export const SERVICE_TYPE_IMAGES: Record<ServiceType, string> = {
  ar_condicionado: "arcondicionado.jpg",
  sistema_solar: "sistema_solar.jpg",
  motor_portao: "portao.png",
  cameras: "camera.png",
};

export function normalizeServiceType(value?: string | null): ServiceType {
  const normalized = (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const aliases: Record<string, ServiceType> = {
    arcondicionado: "ar_condicionado",
    ar_condicionado: "ar_condicionado",
    sistema_solar: "sistema_solar",
    sistemas_solares: "sistema_solar",
    sistema_solares: "sistema_solar",
    motor_portao: "motor_portao",
    motor_de_portao: "motor_portao",
    motor_portao_eletrico: "motor_portao",
    camera: "cameras",
    cameras: "cameras",
  };

  return aliases[normalized] ?? "cameras";
}
