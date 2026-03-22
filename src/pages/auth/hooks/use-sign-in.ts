/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail 
} from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase.config";
import { userService } from "@/services/firebase/user.service";
import { useAuthStore } from "@/store/auth.store";
import { signInSchema, type AuthFormData } from "../utils/auth.schema";

export function useSignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" }
  });

  const handleAuthSuccess = async (firebaseUser: any) => {
    const token = await firebaseUser.getIdToken();
    const userProfile = await userService.syncUserProfile(firebaseUser);
    setUser(userProfile, token);
    navigate("/app/dashboard", { replace: true });
  };

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (!isSignUp) {
        const methods = await fetchSignInMethodsForEmail(auth, data.email);
        
        if (methods.length === 0) {
          setIsSignUp(true);
          return;
        }

        const result = await signInWithEmailAndPassword(auth, data.email, data.password);
        await handleAuthSuccess(result.user);
      } else {
        if (data.password !== data.confirmPassword) {
          setError("confirmPassword", { type: "manual", message: "As senhas não conferem" });
          return;
        }
        clearErrors("confirmPassword");

        const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await handleAuthSuccess(result.user);
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error.code);
      if (error.code === "auth/wrong-password") {
        setError("password", { message: "Senha incorreta" });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthSuccess(result.user);
    } catch (error) {
      console.error("Erro Google:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    handleGoogleSignIn,
    errors,
    isSubmitting,
    isSignUp,
  };
}