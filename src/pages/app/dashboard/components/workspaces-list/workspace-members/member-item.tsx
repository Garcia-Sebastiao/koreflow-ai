import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { BaseDropdown } from "@/components/shared/base-dropdown/base-dropdown";
import { ConfirmModal } from "@/components/shared/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { TrashIcon, UserStarIcon } from "lucide-react";
import { useState } from "react";
import type { Member } from "@/types/organization.types";

interface MemberItemProps {
  member: Member;
  isLoading: boolean;
  onRemove: () => void;
  onPromote: () => void;
}

export function MemberItem({
  member,
  isLoading,
  onRemove,
  onPromote,
}: MemberItemProps) {
  const [modalType, setModalType] = useState<"delete" | "leader" | undefined>(
    undefined,
  );
  const { isOpen, onClose, onOpen } = useOpen();

  const handleClose = () => {
    onClose();
    setModalType(undefined);
  };

  const handleOpen = (type: "delete" | "leader") => {
    setModalType(type);
    onOpen();
  };

  const handleConfirm = () => {
    if (modalType === "delete") onRemove();
    if (modalType === "leader") onPromote();
    handleClose();
  };

  return (
    <>
      <div className="flex p-2 rounded-lg hover:bg-gray-100 transition-all items-center justify-between">
        <div className="flex items-center gap-x-4">
          <BaseAvatar
            src={member?.avatar}
            className="w-8 h-8"
            name={member?.name}
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">{member?.name}</span>
            {(member?.role == "admin" || member?.title) && (
              <span className="font-medium text-xs text-gray-500">
                {member?.title ?? "Administrador"}
              </span>
            )}
          </div>
        </div>

        <BaseDropdown>
          <div className="flex flex-col">
            <Button
              onClick={() => handleOpen("delete")}
              disabled={isLoading}
              className="text-gray-500 hover:text-red-500 justify-start bg-transparent hover:bg-red-500/10"
            >
              <TrashIcon />
              Remover
            </Button>

            {member?.role !== "leader" && (
              <Button
                onClick={() => handleOpen("leader")}
                disabled={isLoading}
                className="text-gray-500 hover:text-primary justify-start bg-transparent hover:bg-primary/10"
              >
                <UserStarIcon />
                Colocar como Líder
              </Button>
            )}
          </div>
        </BaseDropdown>
      </div>

      {isOpen && (
        <ConfirmModal
          danger={modalType === "delete"}
          onConfirm={handleConfirm}
          title={modalType === "delete" ? "Remover membro?" : "Tornar líder?"}
          label={
            modalType === "delete"
              ? `Tem certeza que pretende remover ${member?.name}?`
              : `Tem certeza que pretende tornar ${member?.name} em líder?`
          }
          onClose={handleClose}
        />
      )}
    </>
  );
}
