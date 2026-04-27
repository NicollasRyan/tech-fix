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
  valueService: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 0.01, {
      message: "Informe um valor válido",
    }),
  serviceDate: z.any().nullable(),
  usedParts: z.array(z.string()).optional(),
  notify: z.boolean().optional(),
  notificationDate: z.any().optional().nullable(),
});
