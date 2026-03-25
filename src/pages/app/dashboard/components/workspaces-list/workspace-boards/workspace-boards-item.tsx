import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { BaseDropdown } from "@/components/shared/base-dropdown/base-dropdown";
import { ConfirmModal } from "@/components/shared/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { Board } from "@/types/organization.types";
import type { Timestamp } from "firebase/firestore";

interface WorkspaceBoardsItemProps {
  board: Board;
  isLoading: boolean;
  onDelete: () => void;
}

export function WorkspaceBoardsItem({
  board,
  isLoading,
  onDelete,
}: WorkspaceBoardsItemProps) {
  const { isOpen, onClose, onOpen } = useOpen();
  const navigate = useNavigate();

  const handleConfirm = () => {
    onDelete();
    onClose();
  };

  const handleNavigate = () => {
    navigate(`/app/board/${board.id}`);
  };

  const date = (board.createdAt as Timestamp)?.seconds
    ? new Date((board.createdAt as Timestamp).seconds * 1000)
    : null;

  return (
    <>
      <div
        onClick={handleNavigate}
        className="flex p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-200 transition-all cursor-pointer items-center justify-between group"
      >
        <div className="flex items-center gap-x-3">
          <BaseAvatar src="" className="w-8 h-8" name={board.title} />

          <div className="flex flex-col">
            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {board.title}
            </span>
            <span className="text-xs text-gray-400">
              {date ? date.toLocaleDateString("pt-PT") : "Data indisponível"}
            </span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <BaseDropdown>
            <Button
              onClick={onOpen}
              disabled={isLoading}
              className="text-gray-500 w-full hover:text-red-500 justify-start bg-transparent hover:bg-red-500/10"
            >
              <TrashIcon />
              Eliminar Quadro
            </Button>
          </BaseDropdown>
        </div>
      </div>

      {isOpen && (
        <ConfirmModal
          danger
          onConfirm={handleConfirm}
          title="Eliminar quadro?"
          label={`Tem certeza que pretende eliminar o quadro "${board.title}"? Esta ação é irreversível.`}
          onClose={onClose}
        />
      )}
    </>
  );
}
