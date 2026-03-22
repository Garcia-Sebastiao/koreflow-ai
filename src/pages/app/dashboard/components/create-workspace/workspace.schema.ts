import * as yup from "yup";

export const workspaceSchema = yup
  .object({
    name: yup
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .max(30, "Nome muito longo")
      .required("O nome do ambiente é obrigatório"),
  })
  .required();

export type WorkspaceFormData = yup.InferType<typeof workspaceSchema>;
