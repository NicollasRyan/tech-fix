// ...existing code...
import { z } from "zod";

export const maintenanceSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(100, "Título não pode exceder 100 caracteres")
    .trim(),
  description: z.string().optional(),
  valueService: z.number().min(0.01, "Informe um valor válido"),
  usedParts: z.array(z.string()).optional(),
  notify: z.boolean().optional(),
  notificationDate: z.any().optional().nullable(),
});
