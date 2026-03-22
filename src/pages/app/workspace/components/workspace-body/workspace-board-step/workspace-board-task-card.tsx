import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user.types";
import { GrabIcon } from "lucide-react";

export type TaskProps = {
  id: string;
  title: string;
  description: string;
  responsibles: User[];
  priority: "critical" | "high" | "medium" | "small";
};

export function WorkspaceBoardTaskCard({
  title,
  description,
  responsibles,
  priority,
}: TaskProps) {
  const renderPriority = () => {
    switch (priority) {
      case "critical":
        return (
          <span className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-500 font-medium">
            Critica
          </span>
        );

      case "high":
        return (
          <span className="px-4 py-2 rounded-full text-sm bg-red-100 text-red-500 font-medium">
            Alta
          </span>
        );

      case "medium":
        return (
          <span className="px-4 py-2 rounded-full text-sm bg-green-100 text-green-500 font-medium">
            Média
          </span>
        );
      case "small":
        return (
          <span className="px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-500 font-medium">
            Pequena
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4 rounded-xl bg-white p-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center">
            {responsibles?.map((user, index) => (
              <BaseAvatar
                key={user?.uid}
                name={user?.name}
                src={user?.avatar}
                className={cn("size-4", index > 0 && "-ml-2")}
              />
            ))}
          </div>

          <span className="text-lg font-medium">{title}</span>
        </div>

        <GrabIcon className="size-4 text-gray-400" />
      </div>

      <p className="text-gray-500 text-sm">{description}</p>

      {renderPriority()}
    </div>
  );
}
