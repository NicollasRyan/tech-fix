import { z } from "zod";

export const maintenanceSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(500, "Descrição não pode exceder 500 caracteres")
    .trim(),
});
