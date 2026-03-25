import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { boardService } from "@/services/firebase/board.service";
import { toast } from "sonner";
import { BOARD_KEYS } from "../utils/board.keys";
import { boardSchema, type BoardFormData } from "../utils/board.schema";

export function useCreateBoard(workspaceId: string, onSuccess: () => void) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(boardSchema),
  });

  const onSubmit = async (data: BoardFormData) => {
    try {
      await boardService.createBoard(data.title, workspaceId);

      await queryClient.invalidateQueries({
        queryKey: BOARD_KEYS.list(workspaceId),
      });

      toast.success("Quadro criado com sucesso!");
      reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar quadro.");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}