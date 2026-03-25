import { useState } from "react";
import { useParams } from "react-router";
import type { TaskStatus } from "@/types/board.types";
import { useTasksQuery } from "./components/task/hooks/use-task.query";
import { useMoveTask } from "./components/task/hooks/use-move-task";
import { KanbanBoard } from "./components/kanban/kanban-board";
import { CreateTaskModal } from "./components/task/create-task-modal";
import { TaskDetailModal } from "./components/task/task-details-modal";
import { RejectionModal } from "./components/task/rejection-modal";
import { useBoardQuery } from "./use-board-query";

export default function BoardPage() {
  const { id: boardId } = useParams<{ id: string }>();

  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const { data: board } = useBoardQuery(boardId!);
  const workspaceId = board?.workspaceId ?? "";
  const { data: tasks = [] } = useTasksQuery(boardId!, workspaceId);
  const { moveTask, rejectionTask, clearRejection } = useMoveTask(boardId!);

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) moveTask(task, newStatus);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800">
            {board?.title ?? "Carregando..."}
          </h1>
          <span className="text-sm text-gray-400">
            {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto px-8 py-6">
        <KanbanBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onAddTask={(status) => setCreateStatus(status)}
          onTaskClick={(task) => setSelectedTask(task?.id)}
        />
      </div>

      {createStatus && (
        <CreateTaskModal
          isOpen
          onClose={() => setCreateStatus(null)}
          boardId={boardId!}
          workspaceId={board?.workspaceId ?? ""}
          defaultStatus={createStatus}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          isOpen
          taskId={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {rejectionTask && (
        <RejectionModal
          task={rejectionTask}
          onClose={clearRejection}
          onConfirm={(note) => {
            moveTask(rejectionTask, "todo", note);
            clearRejection();
          }}
        />
      )}
    </div>
  );
}
