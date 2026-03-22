/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  label: string;
  value: string;
}

interface BaseSelectProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  options: Option[];
  error?: string;
  className?: string;
}

export function SelectInput({
  name,
  control,
  label,
  placeholder = "Selecione uma opção",
  options,
  error,
  className,
}: BaseSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col w-full gap-2">
      {label && (
        <Label className={cn("text-gray-shade-700 text-sm font-medium")}>
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full h-11 justify-between -mt-1 font-normal text-gray-shade-200 border-gray-shade-100 hover:bg-transparent px-4",
                  field.value && "text-gray-shade-700",
                  error && "border-destructive",
                  className,
                )}
              >
                {field.value
                  ? options.find((opt) => opt.value === field.value)?.label
                  : placeholder}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-shade-300" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Procurar..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Sem Resultados</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => {
                          field.onChange(option.value);
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />

      {error && (
        <span className="text-xs font-medium text-destructive">{error}</span>
      )}
    </div>
  );
}
