import { Button } from "@/components/ui/button";
import { WorkspaceProgress } from "./workspace-progress";
import {
  Maximize2Icon,
  PlusIcon,
  RefreshCwIcon,
  Settings2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "/details",
    label: "Detalhes",
  },
  {
    id: "/board",
    label: "Quadro",
  },
];

export function WorkspaceHeader() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="w-full bg-white border-b border-b-border flex px-8 pt-8 flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <WorkspaceProgress />

        <Button className="px-8">
          <PlusIcon className="size-6 text-white" />
          Cria Etapa
        </Button>
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="flex gap-x-9">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(`/app/workspace/${id}/${tab.id}`)}
              className={cn(
                window.location.pathname?.includes(tab?.id) &&
                  "border-b-primary border-b-3",
                " text-sm py-2 font-medium",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-x-6">
          <button>
            <RefreshCwIcon className="size-5 text-gray-700" />
          </button>

          <button>
            <Maximize2Icon className="size-5 text-gray-700" />
          </button>

          <button>
            <Settings2 className="size-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
