/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { type Control, Controller } from "react-hook-form";

interface BaseOTPInputProps {
  label?: string;
  error?: string;
  name: string;
  control: Control<any>;
}

export function BaseOTPInput({
  label,
  error,
  name,
  control,
}: BaseOTPInputProps) {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      {label && (
        <Label className={error ? "text-destructive" : ""}>{label}</Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
            <InputOTPGroup className="gap-x-5.5">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-14 rounded-lg border"
                  />
                ))}
            </InputOTPGroup>
          </InputOTP>
        )}
      />

      {error && (
        <span className="text-xs text-destructive font-medium">{error}</span>
      )}
    </div>
  );
}
