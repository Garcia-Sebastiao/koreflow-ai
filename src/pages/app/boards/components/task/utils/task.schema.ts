import * as yup from "yup";

export const taskSchema = yup.object({
  title: yup
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título muito longo")
    .required("O título é obrigatório"),
  description: yup.string().max(500, "Descrição muito longa").optional(),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"], "Prioridade inválida")
    .required("Seleciona uma prioridade"),
  assigneeId: yup.string().optional(),
  dueDate: yup.string().optional(),
}).required();

export type TaskFormData = yup.InferType<typeof taskSchema>;