import * as React from "react";
import { BaseInput } from "@/components/shared/input/base-input";
import { BaseModal } from "@/components/shared/modal/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOpen } from "@/hooks/use-open";
import { SearchIcon, Loader2Icon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectedBadge } from "./select-badge";
import { SelectRow } from "./base-select-input-rows";

export interface SelectItem {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface SingleSelectProps {
  mode: "single";
  data: SelectItem[];
  value?: SelectItem | null;
  onChange: (item: SelectItem | null) => void;
  isLoading?: boolean;
  onSearch: (term: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

interface MultiSelectProps {
  mode: "multiple";
  data: SelectItem[];
  value: SelectItem[];
  onChange: (items: SelectItem[]) => void;
  isLoading?: boolean;
  onSearch: (term: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  modalTitle?: string;
}

type BaseSelectInputProps = SingleSelectProps | MultiSelectProps;

export function BaseSelectInput(props: BaseSelectInputProps) {
  const { mode, data, isLoading, onSearch, placeholder, label, error } = props;

  const [term, setTerm] = React.useState("");
  const { isOpen, onOpen, onClose } = useOpen();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleClose = () => {
    setTerm("");
    onSearch("");
    onClose();
  };

  if (mode === "single") {
    const { value, onChange } = props;

    return (
      <div className="flex flex-col gap-y-2 w-full">
        <BaseInput
          label={label}
          error={error}
          value={term}
          onChange={handleSearch}
          placeholder={placeholder ?? "Pesquisar..."}
          className="bg-gray-100 border-none"
          leftElement={<SearchIcon className="w-4 h-4 text-gray-400" />}
          rightElement={
            isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin text-gray-400" />
            ) : undefined
          }
        />

        {(data.length > 0 || (term.length > 1 && !isLoading)) && (
          <div className="border rounded-lg divide-y max-h-52 overflow-y-auto shadow-sm">
            {data.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">
                Nenhum resultado encontrado.
              </p>
            ) : (
              data.map((item) => (
                <SelectRow
                  key={item.id}
                  item={item}
                  isSelected={value?.id === item.id}
                  onSelect={() => {
                    onChange(value?.id === item.id ? null : item);
                    setTerm("");
                    onSearch("");
                  }}
                  mode="single"
                />
              ))
            )}
          </div>
        )}

        {value && (
          <SelectedBadge item={value} onRemove={() => onChange(null)} />
        )}
      </div>
    );
  }

  const { value, onChange, modalTitle } = props as MultiSelectProps;

  const handleAdd = (item: SelectItem) => {
    if (value.find((v) => v.id === item.id)) return;
    onChange([...value, item]);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((v) => v.id !== id));
  };

  return (
    <>
      <div className="flex flex-col gap-y-2 w-full">
        {label && (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        )}

        <button
          type="button"
          onClick={onOpen}
          className={cn(
            "flex items-center gap-x-2 w-full h-11 px-3 rounded-md bg-gray-100",
            "border border-border text-gray-400 text-sm text-left",
            "hover:bg-gray-200 transition-colors",
            error && "border-red-500 border-2",
          )}
        >
          <UsersIcon className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            {value.length === 0
              ? (placeholder ?? "Selecionar membros...")
              : `${value.length} membro(s) selecionado(s)`}
          </span>
          {value.length > 0 && (
            <Badge variant="secondary">{value.length}</Badge>
          )}
        </button>

        {error && (
          <span className="text-xs font-medium text-destructive">{error}</span>
        )}
      </div>

      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle ?? "Selecionar membros"}
        className="max-w-lg!"
      >
        <div className="flex flex-col gap-y-5 w-full">
          <BaseInput
            value={term}
            onChange={handleSearch}
            placeholder={placeholder ?? "Pesquisar por nome ou email..."}
            className="bg-gray-100 border-none"
            leftElement={<SearchIcon className="w-4 h-4 text-gray-400" />}
            rightElement={
              isLoading ? (
                <Loader2Icon className="w-4 h-4 animate-spin text-gray-400" />
              ) : undefined
            }
          />

          {(data.length > 0 || (term.length > 1 && !isLoading)) && (
            <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
              {data.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
                  Nenhum resultado encontrado.
                </p>
              ) : (
                data.map((item) => (
                  <SelectRow
                    key={item.id}
                    item={item}
                    isSelected={!!value.find((v) => v.id === item.id)}
                    onSelect={() =>
                      value.find((v) => v.id === item.id)
                        ? handleRemove(item.id)
                        : handleAdd(item)
                    }
                    mode="multiple"
                  />
                ))
              )}
            </div>
          )}

          {value.length > 0 && (
            <div className="flex flex-col gap-y-2">
              <span className="text-sm font-medium text-gray-600">
                Selecionados ({value.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {value.map((item) => (
                  <SelectedBadge
                    key={item.id}
                    item={item}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleClose} className="w-full h-10">
            Confirmar seleção
          </Button>
        </div>
      </BaseModal>
    </>
  );
}
