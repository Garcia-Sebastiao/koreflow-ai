import { StayUpdatedIllustration } from "@/assets/illustrations/stay-updated-illustration";

export function NoWorkspaces () {
    return <div className="m-auto flex gap-y-4 max-w-md mt-16 flex-col items-center">
        <div className="[&>svg]:size-56">
          <StayUpdatedIllustration />
        </div>

        <h4 className="text-2xl font-semibold text-gray-700">
          Fique por dentro de tudo!
        </h4>

        <p className="text-gray-500 text-center">
          Convide pessoas para quadros e cartões, deixe comentários, adicione
          datas de entrega, e nós mostraremos as atividades mais importantes
          aqui.
        </p>
      </div>
}