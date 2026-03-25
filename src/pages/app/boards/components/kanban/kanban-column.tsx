import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanCard } from "./kanban-card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task.types";
import type { TaskStatus } from "@/types/board.types";

const COLUMN_STYLES: Record<TaskStatus, { dot: string; count: string }> = {
  todo:    { dot: "bg-slate-400",   count: "bg-slate-100 text-slate-500"    },
  doing:   { dot: "bg-blue-400",    count: "bg-blue-50 text-blue-500"       },
  to_test: { dot: "bg-amber-400",   count: "bg-amber-50 text-amber-600"     },
  testing: { dot: "bg-purple-400",  count: "bg-purple-50 text-purple-600"   },
  done:    { dot: "bg-emerald-400", count: "bg-emerald-50 text-emerald-600" },
};

interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ id, label, tasks, onAddTask, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const styles = COLUMN_STYLES[id];

  return (
    <div className="flex flex-col gap-y-3 min-w-72 w-72">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-x-2">
          <span className={cn("w-2 h-2 rounded-full", styles.dot)} />
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", styles.count)}>
            {tasks.length}
          </span>
        </div>
        <Button
          onClick={() => onAddTask(id)}
          className="w-6 h-6 p-0 bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-y-3 flex-1 min-h-24 p-2 rounded-xl transition-colors",
          isOver ? "bg-gray-100" : "bg-gray-50/60"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}