import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task.types";
import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";

interface KanbanCardProps {
  task: Task;
  onClick: () => void;
}

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

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl p-3 shadow-sm border border-gray-100",
        "flex flex-col gap-y-3 cursor-pointer group",
        "hover:shadow-md hover:border-gray-200 transition-all",
        isDragging && "opacity-50 shadow-lg rotate-1",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            PRIORITY_STYLES[task.priority],
          )}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>

        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
        >
          <GripVerticalIcon className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm font-medium text-gray-700 leading-snug">
        {task.title}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        {task.assignee ? (
          <div className="flex items-center gap-x-1.5">
            <BaseAvatar
              src={task.assignee.avatar || ""}
              name={task.assignee.name}
              className="w-5! h-5! min-w-5! min-h-5! rounded-full object-cover"
            />
            <span className="text-xs text-gray-400">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-300">Sem responsável</span>
        )}

        {task.dueDate && (
          <span className="text-xs text-gray-400">
            {new Date(task.dueDate).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
