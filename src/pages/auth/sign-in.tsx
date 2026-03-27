import { Logo } from "@/assets/common/logo";
import { GoogleIcon } from "@/assets/icons/google-icon";
import { BaseInput } from "@/components/shared/input/base-input";
import { PasswordInput } from "@/components/shared/input/password-input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useSignIn } from "./hooks/use-sign-in";
import { useEffect, useState } from "react";
import { Loading } from "../app/loading";

export function SignInPage() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleGoogleSignIn,
    isSignUp,
  } = useSignIn();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full px-4 flex h-dvh items-center justify-center relative">
      <div className="w-full max-w-sm flex flex-col items-center gap-y-4">
        <Logo />

        <div className="text-center mt-6">
          <h4 className="font-semibold text-gray-900 text-2xl">
            {isSignUp ? "Criar conta" : "Iniciar Sessão"}
          </h4>
          {isSignUp && (
            <p className="text-sm text-gray-500 mt-1">
              E-mail não cadastrado. Defina uma senha para continuar.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full flex gap-y-6 flex-col">
          <BaseInput
            disabled
            {...register("email")}
            className="border-none h-11 bg-gray-100"
            placeholder="Digite o seu email"
            error={errors.email?.message}
            readOnly={isSignUp}
          />

          <PasswordInput
            disabled
            {...register("password")}
            className="border-none h-11 bg-gray-100"
            placeholder="Digite a sua senha"
            error={errors.password?.message}
          />

          {isSignUp && (
            <PasswordInput
              {...register("confirmPassword")}
              className="border-none h-11 bg-gray-100"
              placeholder="Confirme a sua senha"
              error={errors.confirmPassword?.message}
            />
          )}

          {!isSignUp && (
            <Link to="#" className="text-sm text-gray-700 underline self-end">
              Esqueceu a sua senha?
            </Link>
          )}

          <Button
            disabled
            type="submit"
            isLoading={isSubmitting}
            className="w-full h-11 bg-primary"
          >
            {isSignUp ? "Cadastrar e Entrar" : "Entrar"}
          </Button>
        </form>

        <div className="flex items-center my-2 w-full gap-x-6">
          <div className="flex-1 border-b border-border" />
          <span className="text-gray-500">Ou</span>
          <div className="flex-1 border-b border-border" />
        </div>

        <Button
          onClick={handleGoogleSignIn}
          variant="ghost"
          className="w-full [&>svg]:size-6! gap-x-4 border-2 border-border h-12 flex items-center"
        >
          <GoogleIcon />
          Entrar com Google
        </Button>
      </div>
    </div>
  );
}
