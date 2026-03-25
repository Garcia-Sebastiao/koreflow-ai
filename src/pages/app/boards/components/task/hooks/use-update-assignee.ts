import { useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/firebase/task.service";
import { TASK_KEYS } from "../utils/task.keys";
import { toast } from "sonner";
import { useState } from "react";
import type { Task } from "@/types/task.types";

export function useUpdateAssignee(task: Task) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateAssignee = async (
    memberId: string | null,
    memberName: string,
    memberAvatar?: string,
  ) => {
    setIsUpdating(true);
    try {
      const assignee = memberId
        ? { userId: memberId, name: memberName, avatar: memberAvatar }
        : undefined;

      await taskService.updateAssignee(task.id, assignee);

      queryClient.setQueryData<Task[]>(
        TASK_KEYS.list(task.boardId),
        (old) =>
          old?.map((t) => (t.id === task.id ? { ...t, assignee } : t)) ?? [],
      );

      toast.success(
        memberId
          ? `Responsável alterado para ${memberName}`
          : "Responsável removido.",
      );
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(task.id) });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar responsável.");
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateAssignee, isUpdating };
}
