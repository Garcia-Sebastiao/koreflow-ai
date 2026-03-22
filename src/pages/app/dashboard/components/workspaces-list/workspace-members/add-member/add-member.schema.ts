import * as yup from "yup";

export const addMemberSchema = yup.object({
  title: yup
    .string()
    .max(50, "Cargo muito longo")
    .optional(),
  role: yup
    .string()
    .oneOf(["admin", "leader", "dev", "qa"], "Role inválido")
    .required("O role é obrigatório"),
}).required();

export type AddMemberFormData = yup.InferType<typeof addMemberSchema>;