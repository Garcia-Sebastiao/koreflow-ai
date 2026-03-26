import { BaseModal } from "@/components/shared/modal/modal";
import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { cn } from "@/lib/utils";
import {
  SparklesIcon,
  CalendarIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  UsersIcon,
  ListTodoIcon,
} from "lucide-react";
import type {
  BoardPerformanceEvaluation,
  BoardMemberSummary,
} from "@/types/performance.types";

interface BoardPerformanceModalProps {
  evaluation: BoardPerformanceEvaluation;
  onClose: () => void;
}

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

function ScoreRing({
  score,
  size = "lg",
}: {
  score: number;
  size?: "sm" | "lg";
}) {
  const isLg = size === "lg";
  const dim = isLg ? 96 : 56;
  const r = isLg ? 36 : 20;
  const sw = isLg ? 7 : 5;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const color =
    score >= 80
      ? "#10b981"
      : score >= 60
        ? "#3b82f6"
        : score >= 40
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dim, height: dim }}
    >
      <svg className="absolute inset-0 -rotate-90" width={dim} height={dim}>
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={sw}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="flex flex-col items-center leading-none">
        <span
          className={cn(
            "font-bold text-gray-800",
            isLg ? "text-2xl" : "text-sm",
          )}
        >
          {score}
        </span>
        {isLg && <span className="text-xs text-gray-400 mt-0.5">/ 100</span>}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 rounded-2xl p-4 border",
        accent
          ? "bg-primary/5 border-primary/20"
          : "bg-gray-50 border-gray-100",
      )}
    >
      <div className="flex items-center gap-x-2 text-gray-400">
        {icon}
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <span
        className={cn(
          "text-2xl font-bold",
          accent ? "text-primary" : "text-gray-800",
        )}
      >
        {value}
      </span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function MemberCard({ member }: { member: BoardMemberSummary }) {
  const rating = RATING_CONFIG[member.rating];
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex flex-col gap-y-3",
        rating.border,
        rating.bg,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <BaseAvatar name={member.userName} className="w-9 h-9" />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {member.userName}
            </p>
            <span className="text-xs text-gray-500">
              {member.tasksInvolved} tarefa(s)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <ScoreRing score={member.averageScore} size="sm" />
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full bg-white border",
              rating.color,
              rating.border,
            )}
          >
            {rating.label}
          </span>
        </div>
      </div>

      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-gray-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            rating.bar,
          )}
          style={{ width: `${member.averageScore}%` }}
        />
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">{member.summary}</p>

      <div className="grid grid-cols-2 gap-3">
        {member.strengths.length > 0 && (
          <div className="flex flex-col gap-y-1">
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-x-1">
              <TrendingUpIcon className="w-3 h-3" /> Pontos fortes
            </span>
            {member.strengths.map((s, i) => (
              <span
                key={i}
                className="text-xs text-gray-600 flex items-start gap-x-1"
              >
                <CheckCircle2Icon className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                {s}
              </span>
            ))}
          </div>
        )}
        {member.improvements.length > 0 && (
          <div className="flex flex-col gap-y-1">
            <span className="text-xs font-semibold text-amber-700 flex items-center gap-x-1">
              <TrendingDownIcon className="w-3 h-3" /> A melhorar
            </span>
            {member.improvements.map((s, i) => (
              <span
                key={i}
                className="text-xs text-gray-600 flex items-start gap-x-1"
              >
                <AlertTriangleIcon className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BoardPerformanceModal({
  evaluation,
  onClose,
}: BoardPerformanceModalProps) {
  const { stats } = evaluation;

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      className="max-w-3xl! overflow-y-auto"
      innerClassName="pb-6"
    >
      <div className="flex flex-col gap-y-6 w-full">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-x-4">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
              <BarChart3Icon className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Avaliação do Board
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              {evaluation.boardTitle}
            </h2>
            <span className="text-xs text-gray-400 flex items-center gap-x-1">
              <CalendarIcon className="w-3 h-3" />
              Gerada em{" "}
              {new Date(evaluation.evaluatedAt).toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <ScoreRing score={evaluation.overallScore} size="lg" />
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<ListTodoIcon className="w-4 h-4" />}
            label="Total de Tarefas"
            value={stats.totalTasks}
            sub={`${stats.completedTasks} concluídas`}
            accent
          />
          <StatCard
            icon={<CheckCircle2Icon className="w-4 h-4" />}
            label="Taxa de Conclusão"
            value={`${stats.completionRate}%`}
            sub={`${stats.onTimeRate}% no prazo`}
          />
          <StatCard
            icon={<AlertTriangleIcon className="w-4 h-4" />}
            label="Reprovações"
            value={stats.totalRejections}
            sub={`${stats.lateTasks} tarefa(s) atrasada(s)`}
          />
        </div>

        {/* ── Resumo geral ── */}
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Resumo Geral
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {evaluation.overallSummary}
          </p>
        </div>

        {/* ── Destaques e Preocupações ── */}
        <div className="grid grid-cols-2 gap-4">
          {evaluation.highlights.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-y-2">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-x-1">
                <TrendingUpIcon className="w-3.5 h-3.5" /> Destaques
              </span>
              {evaluation.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-xs text-emerald-700 flex items-start gap-x-1.5"
                >
                  <CheckCircle2Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {h}
                </span>
              ))}
            </div>
          )}
          {evaluation.concerns.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex flex-col gap-y-2">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-x-1">
                <AlertTriangleIcon className="w-3.5 h-3.5" /> Pontos de Atenção
              </span>
              {evaluation.concerns.map((c, i) => (
                <span
                  key={i}
                  className="text-xs text-red-600 flex items-start gap-x-1.5"
                >
                  <AlertTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Membros ── */}
        {evaluation.memberSummaries.length > 0 && (
          <div className="flex flex-col gap-y-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-x-1">
              <UsersIcon className="w-3.5 h-3.5" /> Desempenho Individual
            </span>
            <div className="grid grid-cols-1 gap-3">
              {evaluation.memberSummaries.map((m) => (
                <MemberCard key={m.userId} member={m} />
              ))}
            </div>
          </div>
        )}

        {/* ── Recomendação ── */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-x-3">
          <SparklesIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-y-1">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              Recomendação da IA
            </span>
            <p className="text-sm text-amber-800 leading-relaxed">
              {evaluation.recommendation}
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
