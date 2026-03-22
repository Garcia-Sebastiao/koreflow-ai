import { MenuIcon } from "lucide-react";
import {
  WorkspaceBoardTaskCard,
  type TaskProps,
} from "./workspace-board-task-card";

type WorkspaceStepProps = {
  title: string;
  id: string;
  tasks: TaskProps[];
};

export function WorkspaceBoardStep({ title, tasks }: WorkspaceStepProps) {
  return (
    <div className="flex flex-col w-full max-w-[246.25px]">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <span className="text-lg font-medium">{title}</span>

          <span className="py-2 rounded-full text-sm font-medium px-4 bg-white">
            3
          </span>
        </div>

        <button>
          <MenuIcon className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-y-4">
        {tasks?.map((task) => (
          <WorkspaceBoardTaskCard
            priority="medium"
            title="Abstract Syntax"
            id={task?.id}
            responsibles={[]}
            description="Create an Abstract Syntax Tree using tokens and TreeSitter"
            key={task?.id}
          />
        ))}
      </div>
    </div>
  );
}
