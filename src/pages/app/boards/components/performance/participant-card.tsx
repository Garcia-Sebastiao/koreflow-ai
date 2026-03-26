import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { cn } from "@/lib/utils";
import type { ParticipantEvaluation } from "@/types/performance.types";
import { AlertTriangleIcon, CheckCircle2Icon, ClockIcon, TrendingDownIcon, TrendingUpIcon, XCircleIcon } from "lucide-react";

const RATING_CONFIG = {
  excellent: {
    label: "Excelente",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-500",
  },
  good: {
    label: "Bom",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    bar: "bg-blue-500",
  },
  average: {
    label: "Médio",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-500",
  },
  poor: {
    label: "Fraco",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-500",
  },
};

const ROLE_LABELS = { dev: "Desenvolvedor", qa: "QA", other: "Outro" };

export function Metric({
  icon,
  label,
  value,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-x-2 bg-white/70 rounded-lg px-2.5 py-1.5">
      <span className={cn("text-gray-400", danger && "text-red-400")}>
        {icon}
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-sm text-gray-400">{label}</span>
        <span
          className={cn(
            "text-sm font-semibold text-gray-700",
            danger && "text-red-600",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export function ParticipantCard({
  participant,
}: {
  participant: ParticipantEvaluation;
}) {
  const rating = RATING_CONFIG[participant.rating];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 flex flex-col gap-y-4",
        rating.border,
        rating.bg,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <BaseAvatar name={participant.userName} className="w-9 h-9" />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {participant.userName}
            </p>
            <span className="text-sm text-gray-500">
              {ROLE_LABELS[participant.role]}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-sm font-semibold",
            rating.color,
            "bg-white border",
            rating.border,
          )}
        >
          {rating.label}
        </div>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Score</span>
          <span className={cn("text-sm font-bold", rating.color)}>
            {participant.score}/100
          </span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              rating.bar,
            )}
            style={{ width: `${participant.score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {participant.timeToStart != null && (
          <Metric
            icon={<ClockIcon className="w-3 h-3" />}
            label="Início"
            value={`${participant.timeToStart}h`}
          />
        )}
        {participant.deliveryTime != null && (
          <Metric
            icon={<TrendingUpIcon className="w-3 h-3" />}
            label="Entrega"
            value={`${participant.deliveryTime}h`}
          />
        )}
        {participant.timeToTest != null && (
          <Metric
            icon={<ClockIcon className="w-3 h-3" />}
            label="p/ Testar"
            value={`${participant.timeToTest}h`}
          />
        )}
        {participant.rejectionCount > 0 && (
          <Metric
            icon={<XCircleIcon className="w-3 h-3 text-red-500" />}
            label="Reprovações"
            value={String(participant.rejectionCount)}
            danger
          />
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed border-t border-white/60 pt-3">
        {participant.summary}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {participant.strengths.length > 0 && (
          <div className="flex flex-col gap-y-1.5">
            <span className="text-sm font-semibold text-emerald-700 flex items-center gap-x-1">
              <TrendingUpIcon className="w-3 h-3" /> Pontos fortes
            </span>
            {participant.strengths.map((s, i) => (
              <span
                key={i}
                className="text-sm text-gray-600 flex items-start gap-x-1"
              >
                <CheckCircle2Icon className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />{" "}
                {s}
              </span>
            ))}
          </div>
        )}
        {participant.improvements.length > 0 && (
          <div className="flex flex-col gap-y-1.5">
            <span className="text-sm font-semibold text-amber-700 flex items-center gap-x-1">
              <TrendingDownIcon className="w-3 h-3" /> A melhorar
            </span>
            {participant.improvements.map((s, i) => (
              <span
                key={i}
                className="text-sm text-gray-600 flex items-start gap-x-1"
              >
                <AlertTriangleIcon className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />{" "}
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {participant.rejectionReasons.length > 0 && (
        <div className="flex flex-col gap-y-1.5 border-t border-white/60 pt-3">
          <span className="text-sm font-semibold text-red-600">
            Motivos de reprovação
          </span>
          {participant.rejectionReasons.map((r, i) => (
            <p
              key={i}
              className="text-sm text-red-500 rounded-lg px-2 py-1"
            >
              "{r}"
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
