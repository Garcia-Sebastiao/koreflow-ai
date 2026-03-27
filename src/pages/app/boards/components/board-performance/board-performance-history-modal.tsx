import { BaseModal } from "@/components/shared/modal/modal";
import {
  BarChart3Icon, ChevronRightIcon, TrendingUpIcon,
  TrendingDownIcon, MinusIcon, SparklesIcon, Loader2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BoardPerformanceEvaluation } from "@/types/performance.types";

interface BoardEvaluationHistoryModalProps {
  boardTitle: string;
  history: BoardPerformanceEvaluation[];
  isLoading: boolean;
  onSelect: (evaluation: BoardPerformanceEvaluation) => void;
  onClose: () => void;
}

const SCORE_COLOR = (score: number) =>
  score >= 80 ? "text-emerald-600" : score >= 60 ? "text-blue-600" : score >= 40 ? "text-amber-600" : "text-red-500";

const SCORE_BG = (score: number) =>
  score >= 80 ? "bg-emerald-50 border-emerald-200" : score >= 60 ? "bg-blue-50 border-blue-200" : score >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

function ScoreTrend({ current, previous }: { current: number; previous?: number }) {
  if (previous == null) return null;
  const diff = current - previous;
  if (diff === 0) return <MinusIcon className="w-3.5 h-3.5 text-gray-400" />;
  return diff > 0
    ? <span className="flex items-center gap-x-0.5 text-emerald-600 text-xs font-semibold"><TrendingUpIcon className="w-3.5 h-3.5" />+{diff}</span>
    : <span className="flex items-center gap-x-0.5 text-red-500 text-xs font-semibold"><TrendingDownIcon className="w-3.5 h-3.5" />{diff}</span>;
}

function ProgressBar({ history }: { history: BoardPerformanceEvaluation[] }) {
  if (history.length < 2) return null;
  const scores = [...history].reverse().map((e) => e.overallScore);
  const max = 100;

  return (
    <div className="flex flex-col gap-y-2 bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-x-1">
        <BarChart3Icon className="w-3.5 h-3.5" /> Progresso ao Longo do Tempo
      </span>
      <div className="flex items-end gap-x-1.5 h-14">
        {scores.map((score, i) => (
          <div key={i} className="flex flex-col items-center gap-y-1 flex-1">
            <span className={cn("text-xs font-bold", SCORE_COLOR(score))}>{score}</span>
            <div className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${(score / max) * 40}px`,
                backgroundColor: score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>1ª avaliação</span>
        <span>Mais recente</span>
      </div>
    </div>
  );
}

export function BoardPerformanceHistoryModal({
  boardTitle,
  history,
  isLoading,
  onSelect,
  onClose,
}: BoardEvaluationHistoryModalProps) {
  return (
    <BaseModal isOpen onClose={onClose} className="max-w-lg!" innerClassName="pb-6">
      <div className="flex flex-col gap-y-5 w-full">

        <div className="flex items-start gap-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BarChart3Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Histórico de Avaliações</h2>
            <p className="text-xs text-gray-400">{boardTitle}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2Icon className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center gap-y-2 py-10">
            <SparklesIcon className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-400">Ainda não há avaliações para este board.</p>
          </div>
        ) : (
          <>
            <ProgressBar history={history} />

            <div className="flex flex-col gap-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {history.length} avaliação(ões)
              </span>

              {history.map((evaluation, i) => {
                const previous = history[i + 1]?.overallScore;
                return (
                  <button
                    key={evaluation.id}
                    type="button"
                    onClick={() => onSelect(evaluation)}
                    className={cn(
                      "w-full flex items-center gap-x-4 p-4 rounded-2xl border transition-all text-left",
                      "hover:shadow-sm hover:scale-[1.01]",
                      SCORE_BG(evaluation.overallScore)
                    )}
                  >
                    <div className="flex flex-col items-center shrink-0 w-8">
                      <span className="text-xs text-gray-400 font-medium">#{evaluation.evaluationIndex}</span>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <span className={cn("text-2xl font-bold leading-none", SCORE_COLOR(evaluation.overallScore))}>
                        {evaluation.overallScore}
                      </span>
                      <span className="text-xs text-gray-400">/ 100</span>
                    </div>

                    <div className="flex flex-col gap-y-1 flex-1 min-w-0">
                      <span className="text-xs font-semibold text-gray-700">
                        {new Date(evaluation.evaluatedAt).toLocaleDateString("pt-PT", {
                          day: "2-digit", month: "long", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                      <div className="flex items-center gap-x-3 flex-wrap">
                        <span className="text-xs text-gray-500">
                          {evaluation.stats.completedTasks}/{evaluation.stats.totalTasks} tarefas
                        </span>
                        <span className="text-xs text-gray-500">
                          {evaluation.stats.completionRate}% conclusão
                        </span>
                        {evaluation.stats.totalRejections > 0 && (
                          <span className="text-xs text-red-500">
                            {evaluation.stats.totalRejections} reprovação(ões)
                          </span>
                        )}
                      </div>
                      <ScoreTrend current={evaluation.overallScore} previous={previous} />
                    </div>

                    <ChevronRightIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}