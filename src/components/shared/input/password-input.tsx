import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { BaseInput } from "@/components/shared/input/base-input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative w-full">
      <BaseInput
        ref={ref}
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        rightElement={
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setVisible((prev) => !prev)}
          >
            {visible ? (
              <EyeOff className="text-gray-400 size-5 mt-1"  />
            ) : (
              <Eye className="text-gray-400 size-5 mt-1"  />
            )}
          </button>
        }
      />
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
