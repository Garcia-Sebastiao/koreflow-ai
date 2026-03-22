import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  required?: boolean;
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      label,
      error,
      className,
      id,
      rightElement,
      leftElement,
      required,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-1 flex-col w-full gap-2">
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              error && "text-destructive",
              "text-gray-700 text-sm! font-medium!",
            )}
          >
            {label}
            {required && <span className="text-red-500 font-medium">*</span>}
          </Label>
        )}

        <div className="relative">
          {leftElement && (
            <div className="top-1/2 -translate-y-1/2 left-3 absolute">
              {leftElement}
            </div>
          )}

          <Input
            autoComplete="off"
            ref={ref}
            className={cn(
              "disabled:bg-gray-shade-50 h-11 placeholder:text-gray-400 border border-border!",
              leftElement && "pl-10",
              className,
              !!error && "border-red-500! border-2! rounded-lg",
            )}
            {...props}
          />

          {rightElement && (
            <div className="top-1/2 -translate-y-1/2 right-4 absolute">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <span className="text-xs font-medium text-destructive">{error}</span>
        )}
      </div>
    );
  },
);

BaseInput.displayName = "BaseInput";

export { BaseInput };
