import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { workspaceSchema, type WorkspaceFormData } from "./workspace.schema";
import { useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/firebase/workspace.service";
import { WORKSPACE_KEYS } from "./workspace.keys";

export function useCreateWorkspace(onSuccess: () => void) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceFormData>({
    resolver: yupResolver(workspaceSchema),
  });

  const onSubmit = async (data: WorkspaceFormData) => {
    if (!user) return;

    try {
      await workspaceService.createWorkspace(data.name, user.uid, {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });

      await queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.list(user.uid),
      });

      toast.success("Ambiente criado com sucesso!");
      reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar ambiente.");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}