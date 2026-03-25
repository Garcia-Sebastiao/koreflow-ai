import { BaseModal } from "@/components/shared/modal/modal";
import { BaseInput } from "@/components/shared/input/base-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { TaskStatus } from "@/types/board.types";
import { useMembersQuery } from "@/pages/app/dashboard/components/workspaces-list/workspace-members/hooks/use-members.query";
import { useCreateTask } from "./hooks/use-create-task";
import { SelectInput } from "@/components/shared/input/select-input/select-input";

const PRIORITY_OPTIONS = [
  { label: "Baixa", value: "low" },
  { label: "Média", value: "medium" },
  { label: "Alta", value: "high" },
];

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  workspaceId: string;
  defaultStatus: TaskStatus;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  boardId,
  workspaceId,
  defaultStatus,
}: CreateTaskModalProps) {
  const { data: members = [] } = useMembersQuery(workspaceId);

  const memberOptions = members.map((m) => ({
    label: m.name,
    value: m.userId,
  }));

  const { register, handleSubmit, control, errors, isSubmitting } =
    useCreateTask(boardId, workspaceId, defaultStatus, members, onClose);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Nova Tarefa" className="max-w-lg!">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 w-full">

        <BaseInput
          {...register("title")}
          label="Título"
          placeholder="Ex: Implementar autenticação"
          className="bg-gray-100 border-none"
          error={errors.title?.message}
        />

        <div className="flex flex-col gap-y-2">
          <Label className="text-gray-700 text-sm font-medium">Detalhes</Label>
          <Textarea
            {...register("description")}
            placeholder="Descreve a tarefa..."
            className="bg-gray-100 border-none resize-none min-h-24"
          />
          {errors.description && (
            <span className="text-xs text-destructive">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            name="priority"
            control={control}
            label="Prioridade"
            options={PRIORITY_OPTIONS}
            error={errors.priority?.message}
          />

          <SelectInput
            name="assigneeId"
            control={control}
            label="Responsável"
            placeholder="Sem responsável"
            options={memberOptions}
            error={errors.assigneeId?.message}
          />
        </div>

        <BaseInput
          {...register("dueDate")}
          label="Prazo"
          type="date"
          className="bg-gray-100 border-none"
          error={errors.dueDate?.message}
        />

        <div className="flex gap-x-3 pt-1">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1 h-10">
            Criar Tarefa
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}