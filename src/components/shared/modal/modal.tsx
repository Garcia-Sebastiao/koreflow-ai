import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  showCloseButton?: boolean;
}

export function BaseModal({
  title,
  isOpen,
  onClose,
  children,
  className,
  innerClassName,
  showCloseButton = true,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "sm:max-w-106.25 transition-all lg:max-w-164 px-0 rounded-xl",
          className,
        )}
      >
        {title && (
          <DialogHeader className="border-b px-4 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-shade-700">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}

        <div className={cn("w-full px-4", innerClassName)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}