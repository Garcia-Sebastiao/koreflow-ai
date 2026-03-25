import { taskService } from "@/services/firebase/task.service";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { TASK_KEYS } from "../utils/task.keys";
import type { Task } from "@/types/task.types";

export function useCreateComment({ task }: { task: Task }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);

  const createComment = async ({
    comment,
    setComment,
  }: {
    comment: string;
    setComment: (value: string) => void;
  }) => {
    if (!comment.trim() || !user) return;
    setIsSending(true);
    try {
      await taskService.addComment(task.id, {
        taskId: task.id,
        userId: user.uid,
        userName: user.name,
        userAvatar: user.avatar,
        content: comment.trim(),
        type: "comment",
      });
      await queryClient.invalidateQueries({
        queryKey: TASK_KEYS.comments(task.id),
      });
      setComment("");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar comentário.");
    } finally {
      setIsSending(false);
    }
  };

  return { createComment, isSending };
}
