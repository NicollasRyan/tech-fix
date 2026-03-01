import { z } from "zod";
import { SERVICE_TYPES } from "../../constants/serviceTypes.ts";

export const serviceSchema = z
  .object({
    clientName: z
      .string()
      .min(1, "Nome do cliente é obrigatório")
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(100, "Nome não pode exceder 100 caracteres")
      .trim(),
    serviceType: z
      .string()
      .refine(
        (value): value is (typeof SERVICE_TYPES)[number] =>
          SERVICE_TYPES.includes(value as (typeof SERVICE_TYPES)[number]),
        "Tipo de servico e obrigatorio",
      ),
    maintenance: z
      .string()
      .max(500, "Descrição não pode exceder 500 caracteres")
      .trim()
      .optional(),
    valueService: z
      .string()
      .min(1, "Valor do serviço é obrigatório")
      .refine((value) => {
        // remove prefix/symbols, thousands separators and normalize decimal comma
        const cleaned = String(value)
          .replace(/[^0-9,.-]/g, "") // keep digits, comma, dot, minus
          .replace(/\./g, "") // remove thousand separators
          .replace(/,/g, "."); // convert decimal comma to dot
        const num = parseFloat(cleaned);
        return !isNaN(num) && num > 0;
      }, "Valor deve ser um número positivo"),
    notify: z.boolean(),
    notificationDate: z.any().nullable(),
    phone: z
      .string()
      .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido")
      .optional()
      .or(z.literal("")),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    cpf: z
      .string()
      .regex(
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        "CPF deve estar no formato XXX.XXX.XXX-XX",
      )
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .max(200, "Endereço não pode exceder 200 caracteres")
      .trim()
      .optional()
      .or(z.literal("")),
    equipmentModel: z
      .string()
      .max(100, "Modelo do equipamento não pode exceder 100 caracteres")
      .trim()
      .optional()
      .or(z.literal("")),
    equipmentBrand: z
      .string()
      .max(100, "Marca não pode exceder 100 caracteres")
      .trim()
      .optional()
      .or(z.literal("")),
    usedParts: z.array(z.string()).optional(),
  })
  .refine((data) => !data.notify || (data.notify && data.notificationDate), {
    message:
      "Data de notificação é obrigatória quando notificação está ativada",
    path: ["notificationDate"],
  });
