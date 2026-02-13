import { z } from "zod";

export const serviceSchema = z.object({
  clientName: z
    .string()
    .min(1, "Nome do cliente é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome não pode exceder 100 caracteres")
    .trim(),
  serviceType: z
    .string()
    .min(1, "Tipo de serviço é obrigatório"),
  description: z
    .string()
    .max(500, "Descrição não pode exceder 500 caracteres")
    .trim()
    .optional(),
  valueService: z
    .string()
    .min(1, "Valor do serviço é obrigatório")
    .refine(
      (value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0,
      "Valor deve ser um número positivo"
    ),
  notify: z.boolean(),
  notificationDate: z.any().nullable(),
}).refine(
  (data) => !data.notify || (data.notify && data.notificationDate),
  {
    message: "Data de notificação é obrigatória quando notificação está ativada",
    path: ["notificationDate"],
  }
);
