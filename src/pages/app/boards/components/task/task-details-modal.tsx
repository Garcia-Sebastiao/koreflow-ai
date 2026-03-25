import { useState } from "react";
import { BaseModal } from "@/components/shared/modal/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import {
  CalendarIcon,
  AlertTriangleIcon,
  SendIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task.types";
import { useCommentsQuery } from "./hooks/use-comments.query";
import { useCreateComment } from "./hooks/use-create-commet.query";
import { AssigneeSelector } from "./assignee-selector";
import { useTaskQuery } from "./hooks/use-task.query";

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-500",
  medium: "bg-amber-50 text-amber-600",
  high: "bg-red-50 text-red-500",
};

const PRIORITY_LABELS = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

interface TaskDetailModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({
  taskId,
  isOpen,
  onClose,
}: TaskDetailModalProps) {
  const { data: taskData, isPending: isGettingTask } = useTaskQuery(taskId);
  const { createComment, isSending } = useCreateComment({
    task: taskData as Task,
  });
  const task = taskData as Task;


  const { data: comments = [] } = useCommentsQuery(task?.id as string);
  const [comment, setComment] = useState("");

  const handleSendComment = () => {
    createComment({ comment, setComment });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={task?.title}
      className="max-w-2xl!"
    >
      {isGettingTask ? (
        <div className="w-full py-10 flex items-center justify-center">
          <Loader2 className="animate-spin size-5 text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-6 w-full">
          <div className="flex w-full justify-between items-center flex-wrap gap-3">
            <div className="flex flex-col gap-y-1">
              <span className="text-gray-700 text-sm font-medium">
                Responsável
              </span>
              <AssigneeSelector task={task} workspaceId={task.workspaceId} />
            </div>

            <div className="flex items-center gap-x-6">
              {task.dueDate && (
                <div className="flex items-center gap-x-1.5 text-xs text-gray-500">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {task?.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("pt-PT")
                    : "Data indisponível"}
                </div>
              )}
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  PRIORITY_STYLES[task.priority],
                )}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
              {task.description}
            </p>
          )}

          <div className="flex flex-col gap-y-4">
            <h6 className="text-sm font-semibold text-gray-700">
              Comentários ({comments.length})
            </h6>

            <div className="flex flex-col gap-y-3 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  Ainda não há comentários.
                </p>
              ) : (
                comments.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-x-3 p-3 rounded-xl",
                      item.type === "rejection"
                        ? "bg-red-50 border border-red-100"
                        : "bg-gray-50",
                    )}
                  >
                    <BaseAvatar
                      src={item.userAvatar}
                      name={item.userName}
                      className="w-7 h-7 shrink-0"
                    />
                    <div className="flex flex-col gap-y-1 flex-1">
                      <div className="flex items-center gap-x-2">
                        <span className="text-sm font-semibold text-gray-700">
                          {item.userName}
                        </span>
                        {item.type === "rejection" && (
                          <div className="flex items-center gap-x-1 text-red-500">
                            <AlertTriangleIcon className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              Reprovação
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">
                          {task?.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("pt-PT")
                            : "Data indisponível"}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          item.type === "rejection"
                            ? "text-red-600"
                            : "text-gray-600",
                        )}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-x-3 items-end">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreve um comentário..."
                className="bg-gray-100 border-none resize-none min-h-16 flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />
              <Button
                onClick={handleSendComment}
                disabled={!comment.trim() || isSending}
                className="h-10 w-10 p-0 shrink-0"
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
