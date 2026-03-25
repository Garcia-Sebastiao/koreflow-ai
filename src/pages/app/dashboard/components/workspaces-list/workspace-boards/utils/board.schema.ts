import * as yup from "yup";

export const boardSchema = yup.object({
  title: yup
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(50, "Título muito longo")
    .required("O título do quadro é obrigatório"),
}).required();

export type BoardFormData = yup.InferType<typeof boardSchema>;