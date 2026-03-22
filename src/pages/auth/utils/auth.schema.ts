import * as yup from "yup";

export const signInSchema = yup.object({
  email: yup
    .string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
}).required();

export type SignInFormData = yup.InferType<typeof signInSchema>;

export type AuthFormData = SignInFormData & {
  confirmPassword?: string;
};