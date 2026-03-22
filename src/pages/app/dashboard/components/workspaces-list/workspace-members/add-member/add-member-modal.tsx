import { BaseModal } from "@/components/shared/modal/modal";
import { BaseInput } from "@/components/shared/input/base-input";
import { Button } from "@/components/ui/button";
import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import type { SelectItem } from "@/components/shared/input/base-select-input/base-select-input";
import { useAddMemberForm } from "./use-add-member-form";
import { SelectInput } from "@/components/shared/input/select-input/select-input";

const ROLE_OPTIONS = [
  { label: "Desenvolvedor", value: "dev" },
  { label: "QA", value: "qa" },
  { label: "Líder", value: "leader" },
  { label: "Admin", value: "admin" },
];

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  selectedUser: SelectItem | null;
}

export function AddMemberModal({
  isOpen,
  onClose,
  workspaceId,
  selectedUser,
}: AddMemberModalProps) {
  const { register, handleSubmit, control, errors, isSubmitting } =
    useAddMemberForm(workspaceId, selectedUser, onClose);

  if (!selectedUser) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Membro"
      className="max-w-lg!"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 w-full">

        {/* Preview do utilizador selecionado */}
        <div className="flex items-center gap-x-3 p-3 bg-gray-50 rounded-lg border">
          <BaseAvatar
            src={selectedUser.avatar}
            name={selectedUser.name}
            className="w-10 h-10"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">
              {selectedUser.name}
            </span>
            <span className="text-xs text-gray-400">{selectedUser.email}</span>
          </div>
        </div>

        {/* Cargo/Título */}
        <BaseInput
          {...register("title")}
          label="Cargo"
          placeholder="Ex: CEO | Diretor Geral"
          className="bg-gray-100 border-none"
          error={errors.title?.message}
        />

        {/* Role */}
        <SelectInput
          name="role"
          control={control}
          label="Função"
          placeholder="Selecionar função..."
          options={ROLE_OPTIONS}
          error={errors.role?.message}
        />

        <div className="flex gap-x-3">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="flex-1 h-10"
          >
            Adicionar
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}