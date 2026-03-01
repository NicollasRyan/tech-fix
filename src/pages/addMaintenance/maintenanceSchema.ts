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
    .string()
    .min(1, "Valor do serviço é obrigatório")
    .refine((value) => {
      const cleaned = String(value)
        .replace(/[^0-9,.-]/g, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");
      const num = parseFloat(cleaned);
      return !isNaN(num) && num > 0;
    }, "Valor deve ser um número positivo"),
  usedParts: z.array(z.string()).optional(),
  notify: z.boolean().optional(),
  notificationDate: z.any().optional().nullable(),
});
