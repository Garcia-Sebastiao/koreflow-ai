import { Button } from "@/components/ui/button";
import { LayoutTemplate, PlusIcon } from "lucide-react";

export function TemplatesSuggestions() {
  return (
    <div className="h-full sticky top-0 flex flex-col gap-y-6 min-w-sm border-l-2 border-l-border/50 p-4">
      <div className="flex items-center gap-x-2">
        <LayoutTemplate className="size-4 text-gray-700" />
        <h4 className="font-medium text-gray-700">Templates Recomendados!</h4>
      </div>

      <div className="flex flex-col w-full gap-y-4">
        <button className="flex text-left cursor-pointer items-center gap-x-2">
          <div className="w-12 h-10 rounded-sm bg-linear-70 from-primary to-orange-400" />

          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-medium text-gray-700">
              Aprender a montar um cronográma.
            </span>

            <span className="text-xs text-gray-500">
              Quadros de produtividade.
            </span>
          </div>
        </button>

        <button className="flex text-left cursor-pointer items-center gap-x-2">
          <div className="w-12 h-10 rounded-sm bg-linear-70 from-primary to-red-500" />

          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-medium text-gray-700">
              Gerir módulo de vendas internacionais.
            </span>

            <span className="text-xs text-gray-500">Quadros de finanças.</span>
          </div>
        </button>
      </div>

      <Button className="w-full h-10 bg-primary text-white">
        <PlusIcon className="size-6!" />
        Criar novo ambiente
      </Button>
    </div>
  );
}
