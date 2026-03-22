import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BaseTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const BaseTextarea = React.forwardRef<HTMLTextAreaElement, BaseTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-2">
        {label && (
          <Label
            htmlFor={id}
            className={cn("text-gray-shade-700 text-sm! font-medium!")}
          >
            {label}
          </Label>
        )}

        <div className="relative">
          <Textarea
            ref={ref}
            id={id}
            className={cn(
              "disabled:bg-gray-shade-50 min-h-30 placeholder:text-gray-shade-200 border border-gray-shade-100! resize-none",
              error && "border-destructive! rounded-lg",
              className,
            )}
            {...props}
          />
        </div>

        {error && (
          <span className="text-xs font-medium text-destructive">{error}</span>
        )}
      </div>
    );
  },
);

BaseTextarea.displayName = "BaseTextarea";

export { BaseTextarea };
