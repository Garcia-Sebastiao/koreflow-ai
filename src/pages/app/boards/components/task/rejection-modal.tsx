import { useState } from "react";
import { BaseModal } from "@/components/shared/modal/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangleIcon } from "lucide-react";
import type { Task } from "@/types/task.types";

interface RejectionModalProps {
  task: Task;
  onConfirm: (note: string) => void;
  onClose: () => void;
}

export function RejectionModal({ task, onConfirm, onClose }: RejectionModalProps) {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (!note.trim()) return;
    onConfirm(note.trim());
    onClose();
  };

  return (
    <BaseModal isOpen onClose={onClose} className="max-w-lg!">
      <div className="flex flex-col gap-y-5 w-full">

        {/* Aviso */}
        <div className="flex items-start gap-x-3 p-4 bg-red-50 rounded-xl border border-red-100">
          <AlertTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-semibold text-red-700">
              Reprovar tarefa
            </span>
            <span className="text-xs text-red-500">
              A tarefa <strong>"{task.title}"</strong> será devolvida. Esta nota
              será registada e usada na avaliação de desempenho.
            </span>
          </div>
        </div>

        {/* Nota */}
        <div className="flex flex-col gap-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Motivo da reprovação <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Descreve o motivo da reprovação..."
            className="bg-gray-100 border-none resize-none min-h-28"
          />
        </div>

        <div className="flex gap-x-3">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </Button>
          <Button
            disabled={!note.trim()}
            onClick={handleConfirm}
            className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white"
          >
            Reprovar e Devolver
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}