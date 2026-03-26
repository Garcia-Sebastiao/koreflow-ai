import { BaseModal } from "@/components/shared/modal/modal";
import { cn } from "@/lib/utils";
import { SparklesIcon, CalendarIcon, ChartAreaIcon } from "lucide-react";
import type { TaskPerformanceEvaluation } from "@/types/performance.types";
import { useEvaluateTask } from "./use-evaluate-task";
import { queryClient } from "@/config/client.config";
import { PERFORMANCE_KEYS } from "./utils/performance.keys";
import { Button } from "@/components/ui/button";
import type { Task, TaskComment } from "@/types/task.types";
import { Logo } from "@/assets/common/logo";
import { ParticipantCard } from "./participant-card";
import type { Timestamp } from "firebase/firestore";
import { parseDate } from "@/utils/parse-date";

interface PerformanceModalProps {
  task: Task;
  comments: TaskComment[];
}

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
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
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="7"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-800 leading-none">
          {score}
        </span>
        <span className="text-sm text-gray-400 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function TimelineDot({
  done,
  label,
  date,
}: {
  done: boolean;
  label: string;
  date?: string | Timestamp;
}) {
  const parsedDate = parseDate(date);

  return (
    <div className="flex mt-2 flex-col items-center gap-y-1 flex-1">
      <div
        className={cn(
          "w-3 h-3 rounded-full border-2 transition-colors",
          done
            ? "bg-emerald-500 border-emerald-500"
            : "bg-white border-gray-300",
        )}
      />
      <span className="text-sm font-medium text-gray-600 text-center leading-tight">
        {label}
      </span>

      {parsedDate && (
        <span className="text-xs text-gray-400 text-center">
          {parsedDate.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      )}
    </div>
  );
}

export function PerformanceModal({ comments, task }: PerformanceModalProps) {
  const {
    evaluateTask,
    openExisting,
    isEvaluating,
    isModalOpen,
    setIsModalOpen,
    hasEvaluation,
    isGettingEvaluation,
  } = useEvaluateTask(task?.id);

  const evaluation = queryClient.getQueryData<TaskPerformanceEvaluation>(
    PERFORMANCE_KEYS.task(task?.id),
  );
  const timeline = evaluation?.timeline as
    | TaskPerformanceEvaluation["timeline"]
    | undefined;

  const timelineSteps = [
    { label: "Criada", date: timeline?.createdAt, done: true },
    {
      label: "Iniciada",
      date: timeline?.startedAt,
      done: !!timeline?.startedAt,
    },
    {
      label: "Entregue",
      date: timeline?.deliveredAt,
      done: !!timeline?.deliveredAt,
    },
    { label: "A Testar", date: timeline?.testedAt, done: !!timeline?.testedAt },
    {
      label: "Concluída",
      date: timeline?.completedAt,
      done: !!timeline?.completedAt,
    },
  ];

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        disabled={isEvaluating || isGettingEvaluation}
        onClick={
          hasEvaluation ? openExisting : () => evaluateTask(task, comments)
        }
        isLoading={isEvaluating || isGettingEvaluation}
        variant="ghost"
        className="self-end bg-green-500 text-white"
      >
        <ChartAreaIcon />
        {hasEvaluation ? "Ver Avaliação" : "Avaliar Desempenho"}
      </Button>

      {isModalOpen && (
        <BaseModal
          isOpen
          onClose={handleClose}
          className={cn("max-w-5xl! max-h-[95%]! overflow-y-auto")}
          innerClassName="pb-6"
        >
          {isGettingEvaluation || isEvaluating ? (
            <div className="w-full flex-1 flex py-10 items-center justify-center flex-col gap-y-4">
              <div className="animate-spin w-12 h-12 flex items-center justify-center duration-300">
                <Logo />
              </div>

              <h4 className="text-xl font-semibold text-gray-700">
                Carregando Avaliação...
              </h4>
            </div>
          ) : (
            <div className="flex flex-col gap-y-6 w-full">
              <div className="flex items-start justify-between gap-x-4">
                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-x-2">
                    <SparklesIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                      Avaliação de Desempenho
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-800">
                    {evaluation?.taskTitle}
                  </h2>

                  <span className="text-xs text-gray-400 flex items-center gap-x-1">
                    <CalendarIcon className="w-3 h-3" />
                    Gerada em{" "}
                    {new Date(
                      evaluation?.evaluatedAt as string,
                    ).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-y-4 shrink-0">
                  <ScoreRing score={evaluation?.overallScore as number} />
                  <div
                    className={cn(
                      "text-sm font-semibold px-2.5 py-0.5 rounded-full",
                      timeline?.wasLate
                        ? "bg-red-50 text-red-500"
                        : "bg-emerald-50 text-emerald-600",
                    )}
                  >
                    {timeline?.wasLate ? "Atrasada" : "No prazo"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-3 bg-gray-50 rounded-2xl p-4">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Linha do Tempo
                </span>
                <div className="flex items-start gap-x-0">
                  {timelineSteps.map((step, i) => (
                    <div key={step.label} className="flex items-center flex-1">
                      <TimelineDot
                        done={step.done}
                        label={step.label}
                        date={step.date}
                      />
                      {i < timelineSteps.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1 -mt-7 mx-0.5 transition-colors",
                            step.done && timelineSteps[i + 1].done
                              ? "bg-emerald-400"
                              : "bg-gray-200",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {timeline?.totalDuration && (
                  <span className="text-xs text-gray-400 text-right">
                    Duração total:{" "}
                    <strong className="text-gray-600">
                      {timeline?.totalDuration}h
                    </strong>
                  </span>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-y-2">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Resumo Geral
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {evaluation?.overallSummary}
                </p>
              </div>

              {(evaluation?.participants.length as number) > 0 && (
                <div className="flex flex-col gap-y-3">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Avaliação Individual
                  </span>
                  <div className="grid grid-cols-1 gap-4">
                    {evaluation?.participants.map((p) => (
                      <ParticipantCard key={p.userId} participant={p} />
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-x-3">
                <SparklesIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-y-1">
                  <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                    Recomendação da IA
                  </span>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {evaluation?.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </BaseModal>
      )}
    </>
  );
}
