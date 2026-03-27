import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { TaskStatus } from "@/types/board.types";
import { useTasksQuery } from "./components/task/hooks/use-task.query";
import { useMoveTask } from "./components/task/hooks/use-move-task";
import { KanbanBoard } from "./components/kanban/kanban-board";
import { CreateTaskModal } from "./components/task/create-task-modal";
import { TaskDetailModal } from "./components/task/task-details-modal";
import { RejectionModal } from "./components/task/rejection-modal";
import { useBoardQuery } from "./use-board-query";
import { Loading } from "../loading";
import { WorkspaceMembers } from "../dashboard/components/workspaces-list/workspace-members/workspace-members";
import { useEvaluateBoard } from "./components/board-performance/use-evaluate-board";
import { Button } from "@/components/ui/button";
import { BarChart3Icon, ChevronLeft, SparklesIcon } from "lucide-react";
import { BoardPerformanceModal } from "./components/board-performance/board-performace-modal";
import { BoardPerformanceHistoryModal } from "./components/board-performance/board-performance-history-modal";
import { queryClient } from "@/config/client.config";
import { PERFORMANCE_KEYS } from "./components/performance/utils/performance.keys";

export default function BoardPage() {
  const { id: boardId } = useParams<{ id: string }>();

  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const { data: board, isPending: isGettingBoard } = useBoardQuery(boardId!);
  const workspaceId = board?.workspaceId ?? "";

  const {
    evaluateBoard,
    isEvaluating,
    isLoadingHistory,
    history,
    modalView,
    selectedEvaluation,
    openHistory,
    closeModal,
    openDetail,
    backToHistory,
  } = useEvaluateBoard(boardId!);
  const navigate = useNavigate();
  const { data: tasks = [] } = useTasksQuery(boardId!, workspaceId);
  const { moveTask, rejectionTask, clearRejection } = useMoveTask(boardId!);

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) moveTask(task, newStatus);
  };

  if (isGettingBoard) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex flex-col">
          <button
            onClick={() => {
              navigate("/app/dashboard");
            }}
            className="text-sm font-medium text-gray-400 flex items-center gap-x-2 mb-6"
            type="button"
          >
            <ChevronLeft className="size-4 text-gray-500" />
            Voltar
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {board?.title ?? "Carregando..."}
          </h1>
          <span className="text-sm text-gray-400">
            {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-x-4">
          <WorkspaceMembers workspaceId={board?.workspaceId as string} />
          {history.length > 0 && (
            <Button
              onClick={openHistory}
              className="h-9 px-4 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <BarChart3Icon className="w-4 h-4" />
              Histórico de avaliações ({history.length})
            </Button>
          )}
          <Button
            onClick={() => board && evaluateBoard(board.title, tasks)}
            isLoading={isEvaluating}
            className="h-9 px-4 text-sm"
          >
            <SparklesIcon className="w-4 h-4" />
            Nova Avaliação
          </Button>
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

      {modalView === "history" && (
        <BoardPerformanceHistoryModal
          boardTitle={board?.title ?? ""}
          history={history}
          isLoading={isLoadingHistory}
          onSelect={(evaluation) => {
            queryClient.setQueryData(
              PERFORMANCE_KEYS.board(boardId!),
              evaluation,
            );
            openDetail(evaluation);
          }}
          onClose={closeModal}
        />
      )}

      {modalView === "detail" && selectedEvaluation && (
        <BoardPerformanceModal
          evaluation={selectedEvaluation}
          onBack={history.length > 0 ? backToHistory : undefined}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
