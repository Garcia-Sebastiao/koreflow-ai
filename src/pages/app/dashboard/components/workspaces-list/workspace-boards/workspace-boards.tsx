import { useState } from "react";
import { BaseModal } from "@/components/shared/modal/modal";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { LayoutTemplate, PlusIcon, SearchIcon } from "lucide-react";
import { BaseInput } from "@/components/shared/input/base-input";
import { WorkspaceBoardsItem } from "./workspace-boards-item";
import { useBoardsQuery } from "./use-boards.query";
import { useDeleteBoard } from "./use-delete-board";
import { CreateBoardModal } from "./create-board/create-board-modal";
import { useGetMemberByUser } from "../hooks/members.query";

export function WorkspaceBoards({ workspaceId }: { workspaceId: string }) {
  const { isOpen, onOpen, onClose } = useOpen();
  const { member } = useGetMemberByUser({ workspaceId });

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useOpen();

  const [search, setSearch] = useState("");

  const { data: boards = [] } = useBoardsQuery(workspaceId);
  const { handleDelete, isDeletingId } = useDeleteBoard(workspaceId);

  const filtered = boards.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Button onClick={onOpen} className="bg-gray-100 text-gray-500 text-sm">
        <LayoutTemplate className="size-5 text-gray-500" />
        Quadros ({boards.length})
      </Button>

      <BaseModal showCloseButton={false} isOpen={isOpen} onClose={onClose}>
        <div className="w-full flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-700 text-xl">
              Quadros do Ambiente de Trabalho
            </h4>

            {member?.role == "admin" && (
              <Button onClick={onCreateOpen} className="h-9 px-4 text-sm">
                <PlusIcon className="w-4 h-4" />
                Novo quadro
              </Button>
            )}
          </div>

          <BaseInput
            className="border-none bg-gray-100"
            leftElement={<SearchIcon className="size-5 text-gray-400" />}
            placeholder="Procurar quadro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-y-2">
            <h6 className="text-lg font-semibold text-gray-700">
              Existentes ({filtered.length})
            </h6>

            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                {search
                  ? "Nenhum quadro encontrado."
                  : "Ainda não há quadros neste workspace."}
              </p>
            ) : (
              filtered.map((board) => (
                <WorkspaceBoardsItem
                  key={board.id}
                  board={board}
                  isLoading={isDeletingId === board.id}
                  onDelete={() => handleDelete(board.id)}
                />
              ))
            )}
          </div>
        </div>
      </BaseModal>

      <CreateBoardModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        workspaceId={workspaceId}
      />
    </>
  );
}
