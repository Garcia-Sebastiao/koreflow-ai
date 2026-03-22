import { BaseModal } from "@/components/shared/modal/modal";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { LayoutTemplate, SearchIcon } from "lucide-react";
import { WorkspaceBoardsItem } from "./workspace-boards-item";
import { BaseInput } from "@/components/shared/input/base-input";

export function WorkspaceBoards({ workspaceId }: { workspaceId: string }) {
  const { isOpen, onOpen, onClose } = useOpen();
  return (
    <>
      <Button onClick={onOpen} className="bg-gray-100 text-gray-500 text-sm">
        <LayoutTemplate className="size-5 text-gray-500" />
        Quadros (4)
      </Button>

      <BaseModal isOpen={isOpen} className="" onClose={onClose}>
        <div className="w-full flex flex-col gap-y-6">
          <h4 className="font-semibold text-gray-700 text-xl">
            Quadros do Ambiente de Trabalho
          </h4>

          <BaseInput
            className="border-none bg-gray-100"
            leftElement={<SearchIcon className="size-5 text-gray-400" />}
            placeholder="Procurar membro..."
          />

          <div className="flex flex-col gap-y-2">
            <h6 className="text-lg font-semibold text-gray-700">
              Existentes (04)
            </h6>

            <WorkspaceBoardsItem />
            <WorkspaceBoardsItem />
            <WorkspaceBoardsItem />
          </div>
        </div>
      </BaseModal>
    </>
  );
}
