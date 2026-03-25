import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { taskService } from "@/services/firebase/task.service";
import { toast } from "sonner";
import type { Member } from "@/types/organization.types";
import { taskSchema, type TaskFormData } from "../utils/task.schema";
import type { TaskStatus } from "@/types/board.types";
import { TASK_KEYS } from "../utils/task.keys";

export function useCreateTask(
  boardId: string,
  workspaceId: string,
  defaultStatus: TaskStatus,
  members: Member[],
  onSuccess: () => void
) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: { priority: "medium" },
  });

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return;

    const assigneeMember = members.find((m) => m.userId === data.assigneeId);

    try {
      await taskService.createTask({
        boardId,
        workspaceId,
        title: data.title,
        description: data.description,
        status: defaultStatus,
        priority: data.priority as "low" | "medium" | "high",
        assignee: assigneeMember
          ? {
              userId: assigneeMember.userId,
              name: assigneeMember.name,
              avatar: assigneeMember.avatar,
            }
          : undefined,
        dueDate: data.dueDate,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });

      await queryClient.invalidateQueries({
        queryKey: TASK_KEYS.list(boardId),
      });

      toast.success("Tarefa criada com sucesso!");
      reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar tarefa.");
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), control, errors, isSubmitting };
}