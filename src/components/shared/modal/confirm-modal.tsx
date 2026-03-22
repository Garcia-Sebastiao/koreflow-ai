import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  title: string;
  label: string;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
  danger?: boolean;
  isLoading?: boolean;
};

export function ConfirmModal({
  title,
  label,
  onClose,
  onConfirm,
  className,
  danger,
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base">{label}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            disabled={isLoading}
            variant="outline"
            className="border-border font-medium shadow-none"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            disabled={isLoading}
            className={cn("bg-primary", danger && "bg-red-500")}
            onClick={onConfirm}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
