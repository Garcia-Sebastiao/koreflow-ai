import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { WorkspaceMembers } from "../workspace-members/workspace-members";
import { WorkspaceBoards } from "../workspace-boards/workspace-boards";
import type { Workspace } from "@/types/organization.types";
import { BaseDropdown } from "@/components/shared/base-dropdown/base-dropdown";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { ConfirmModal } from "@/components/shared/modal/confirm-modal";
import { useDeleteWorkspace } from "../hooks/use-delete-workspace";
import { Trash2 } from "lucide-react";
import { WorkspaceBoardsItem } from "../workspace-boards/workspace-boards-item";
import { useBoardsQuery } from "../workspace-boards/use-boards.query";
import { useDeleteBoard } from "../workspace-boards/use-delete-board";

interface WorkspaceItemProps {
  workspace: Workspace;
}

export function WorkspaceItem({ workspace }: WorkspaceItemProps) {
  const { isOpen, onOpen, onClose } = useOpen();
  const { handleDelete, isDeleting } = useDeleteWorkspace(workspace.id);
  const { data: boards = [] } = useBoardsQuery(workspace.id);
  const { handleDelete: handleDeleteBoard, isDeletingId } = useDeleteBoard(workspace.id);

  const previewBoards = boards.slice(0, 4);

  const onConfirmDelete = async () => {
    await handleDelete();
    onClose();
  };

  return (
    <>
      <div className="flex flex-col gap-y-6 pb-6 border-b">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-4">
            <BaseAvatar src={workspace.image} name={workspace.name} />
            <h6 className="text-lg font-semibold">{workspace.name}</h6>
          </div>

          <div className="flex items-center gap-x-4">
            <WorkspaceMembers workspaceId={workspace.id} />
            <WorkspaceBoards workspaceId={workspace.id} />
            <BaseDropdown>
              <Button
                variant="ghost"
                className="hover:bg-red-100 w-full justify-start text-gray-500 transition-all hover:text-red-400"
                onClick={onOpen}
              >
                <Trash2 className="size-4" />
                Apagar Workspace
              </Button>
            </BaseDropdown>
          </div>
        </div>

        {previewBoards.length === 0 ? (
          <p className="text-sm text-gray-400">
            Ainda não há quadros neste workspace.
          </p>
        ) : (
          <div className="w-full grid grid-cols-4 gap-4">
            {previewBoards.map((board) => (
              <WorkspaceBoardsItem
                key={board.id}
                board={board}
                isLoading={isDeletingId === board.id}
                onDelete={() => handleDeleteBoard(board.id)}
              />
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <ConfirmModal
          title="Eliminar Ambiente de Trabalho?"
          label="Tem a certeza que pretende eliminar este Ambiente de Trabalho? Esta ação é irreversível."
          onClose={onClose}
          onConfirm={onConfirmDelete}
          danger
          isLoading={isDeleting}
        />
      )}
    </>
  );
}