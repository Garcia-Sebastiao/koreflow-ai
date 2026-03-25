import { useState, useRef, useEffect } from "react";
import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon, SearchIcon, XIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateAssignee } from "./hooks/use-update-assignee";
import type { Task } from "@/types/task.types";
import { useMembersQuery } from "@/pages/app/dashboard/components/workspaces-list/workspace-members/hooks/use-members.query";

interface AssigneeSelectorProps {
  task: Task;
  workspaceId: string;
}

export function AssigneeSelector({ task, workspaceId }: AssigneeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const { data: members = [] } = useMembersQuery(workspaceId);
  const { updateAssignee, isUpdating } = useUpdateAssignee(task);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (
    memberId: string,
    name: string,
    avatar?: string,
  ) => {
    await updateAssignee(memberId, name, avatar);
    setIsOpen(false);
    setSearch("");
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateAssignee(null, "");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-x-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors group"
        disabled={isUpdating}
      >
        {isUpdating ? (
          <Loader2Icon className="w-4 h-4 animate-spin text-gray-400" />
        ) : task.assignee ? (
          <>
            <BaseAvatar
              src={task.assignee.avatar}
              name={task.assignee.name}
              className="w-5! min-w-5! h-5! min-h-5!"
            />
            <span className="text-xs text-gray-600">{task.assignee.name}</span>
            <div
              role="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
            >
              <XIcon className="w-3 h-3" />
            </div>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">?</span>
            </div>
            <span className="text-xs text-gray-400">Sem responsável</span>
          </>
        )}
        <ChevronDownIcon className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-100 rounded-xl shadow-lg w-64">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar membro..."
                className="h-8 pl-7 text-xs bg-gray-50 border-none"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">
                Nenhum membro encontrado.
              </p>
            ) : (
              filtered.map((member) => (
                <button
                  key={member.userId}
                  type="button"
                  onClick={() =>
                    handleSelect(member.userId, member.name, member.avatar)
                  }
                  className={cn(
                    "w-full flex items-center gap-x-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left",
                    task.assignee?.userId === member.userId && "bg-primary/5",
                  )}
                >
                  <BaseAvatar
                    src={member.avatar}
                    name={member.name}
                    className="w-7 h-7 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {member.name}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {member.title ?? member.email}
                    </span>
                  </div>
                  {task.assignee?.userId === member.userId && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          {task.assignee && (
            <div className="border-t border-gray-100 p-1">
              <Button
                type="button"
                onClick={() => updateAssignee(null, "")}
                className="w-full h-8 text-xs justify-start bg-transparent text-red-400 hover:bg-red-50 hover:text-red-500"
              >
                <XIcon className="w-3 h-3" />
                Remover responsável
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
