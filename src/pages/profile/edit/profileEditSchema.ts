import { z } from "zod";

export const profileEditSchema = z.object({
  displayName: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),

  phoneNumber: z
    .string()
    .min(10, "Telefone inválido")
    .max(20, "Telefone inválido")
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido. Use (XX) 9XXXX-XXXX"),

  currentPassword: z.string().default(""),

  newPassword: z.string().default(""),

  confirmPassword: z.string().default(""),
})
  .refine(
    (data) => {
      // Se preencheu newPassword, precisa preencher currentPassword
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Senha atual é obrigatória ao alterar a senha",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // Se preencheu newPassword, precisa ter pelo menos 6 caracteres
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: "Nova senha deve ter no mínimo 6 caracteres",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Se preencheu newPassword, confirmPassword precisa ser igual
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );
