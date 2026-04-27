import z from "zod";

export const serviceSchema = z.object({
  clientName: z.string().min(1, "Informe o nome"),
  serviceType: z.string().min(1, "Selecione o tipo"),
  valueService: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 0.01, {
      message: "Informe um valor válido",
    }),

  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  cpf: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  equipmentModel: z.string().optional(),
  equipmentBrand: z.string().optional(),
  usedParts: z.array(z.string()).optional(),
  serviceDate: z.any().nullable(),

  notify: z.boolean(),
  notificationDate: z.any().nullable(),
  descriptionMaintenance: z.string().optional(),
});
