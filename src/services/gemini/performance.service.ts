/* eslint-disable @typescript-eslint/no-explicit-any */
import { ai, modelId, koreFlowConfig } from "@/config/gemini.config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { Task, TaskComment } from "@/types/task.types";
import type {
  TaskPerformanceEvaluation,
  BoardPerformanceEvaluation,
  BoardTaskSummary,
} from "@/types/performance.types";

function hoursBetween(from?: string, to?: string): number | undefined {
  if (!from || !to) return undefined;
  return (
    Math.round(
      ((new Date(to).getTime() - new Date(from).getTime()) / 3600000) * 10,
    ) / 10
  );
}

function buildTaskContext(task: Task, comments: TaskComment[]): string {
  const rejections = comments.filter((c) => c.type === "rejection");
  const regular = comments.filter((c) => c.type === "comment");
  return `
=== TAREFA ===
ID: ${task.id} | Título: ${task.title}
Prioridade: ${task.priority} | Status: ${task.status}
Responsável: ${task.assignee?.name ?? "Não atribuído"}
Prazo: ${task.dueDate ?? "não definido"}
Criada: ${task.createdAt} | Iniciada: ${task.startedAt ?? "nunca"}
Entregue p/ teste: ${task.deliveredAt ?? "nunca"} | Testes iniciados: ${task.testedAt ?? "nunca"}
Concluída: ${task.completedAt ?? "não concluída"}
Histórico: ${(task.statusHistory ?? []).map((e) => `[${e.occurredAt}] ${e.byUserName}: ${e.fromStatus}→${e.toStatus}`).join("; ") || "nenhum"}
Reprovações (${rejections.length}): ${rejections.map((r) => `"${r.content}" por ${r.userName}`).join("; ") || "nenhuma"}
Comentários (${regular.length}): ${regular.map((c) => `"${c.content}" por ${c.userName}`).join("; ") || "nenhum"}
`.trim();
}

function buildBoardPrompt(
  boardTitle: string,
  tasksContext: string,
  taskSummaries: BoardTaskSummary[],
): string {
  return `
És um especialista em análise de desempenho de equipas de software.
Analisa o board abaixo com todas as suas tarefas e devolve APENAS JSON válido, sem markdown.

=== BOARD: ${boardTitle} ===
${tasksContext}

=== RESUMO DAS TAREFAS (pré-calculado) ===
${JSON.stringify(taskSummaries, null, 2)}

Devolve exactamente este JSON:
{
  "memberSummaries": [
    {
      "userId": string,
      "userName": string,
      "role": "dev" | "qa" | "other",
      "tasksInvolved": number,
      "averageScore": number,
      "totalRejectionCount": number,
      "averageDeliveryTime": number | null,
      "averageTimeToTest": number | null,
      "rating": "excellent" | "good" | "average" | "poor",
      "summary": string,
      "strengths": string[],
      "improvements": string[]
    }
  ],
  "overallScore": number,
  "overallSummary": string,
  "recommendation": string,
  "highlights": string[],
  "concerns": string[]
}

Regras:
- Consolida o desempenho de cada membro em TODAS as tarefas em que esteve envolvido.
- Score geral 0-100. Considera: taxa de conclusão, atrasos, reprovações, qualidade dos comentários.
- Textos em português de Portugal.
`.trim();
}

export const performanceService = {
  async getEvaluation(
    taskId: string,
  ): Promise<TaskPerformanceEvaluation | null> {
    const snap = await getDoc(doc(db, "evaluations", taskId));
    if (!snap.exists()) return null;
    return snap.data() as TaskPerformanceEvaluation;
  },

  async evaluateTask(
    task: Task,
    comments: TaskComment[],
  ): Promise<TaskPerformanceEvaluation> {
    const context = buildTaskContext(task, comments);
    const prompt = `
És um especialista em análise de desempenho de equipas de software.
Analisa os dados abaixo e devolve APENAS JSON válido, sem markdown.
${context}
Devolve:
{
  "timeline": { "wasLate": boolean, "totalDuration": number | null },
  "participants": [{
    "userId": string, "userName": string, "role": "dev"|"qa"|"other",
    "timeToStart": number|null, "deliveryTime": number|null,
    "timeToTest": number|null, "totalCycleTime": number|null,
    "rejectionCount": number, "rejectionReasons": string[],
    "score": number, "rating": "excellent"|"good"|"average"|"poor",
    "summary": string, "strengths": string[], "improvements": string[]
  }],
  "overallScore": number, "overallSummary": string, "recommendation": string
}
Regras: Score 0-100. Textos em português de Portugal.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: koreFlowConfig,
    });

    const clean = (response.text ?? "")
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch {
      throw new Error("O modelo não devolveu JSON válido.");
    }

    const evaluation: TaskPerformanceEvaluation = {
      taskId: task.id,
      taskTitle: task.title,
      evaluatedAt: new Date().toISOString(),
      timeline: {
        createdAt: task.createdAt,
        startedAt: task.startedAt,
        deliveredAt: task.deliveredAt,
        testedAt: task.testedAt,
        completedAt: task.completedAt,
        dueDate: task.dueDate,
        wasLate: parsed.timeline.wasLate,
        totalDuration:
          parsed.timeline.totalDuration ??
          hoursBetween(task.createdAt, task.completedAt),
      },
      participants: parsed.participants,
      overallScore: parsed.overallScore,
      overallSummary: parsed.overallSummary,
      recommendation: parsed.recommendation,
    };

    await setDoc(doc(db, "evaluations", task.id), {
      ...evaluation,
      savedAt: serverTimestamp(),
    });

    return evaluation;
  },

  async getBoardEvaluation(
    boardId: string,
  ): Promise<BoardPerformanceEvaluation | null> {
    const snap = await getDoc(doc(db, "board_evaluations", boardId));
    if (!snap.exists()) return null;
    return snap.data() as BoardPerformanceEvaluation;
  },

  async evaluateBoard(
    boardId: string,
    boardTitle: string,
    tasks: Task[],
    commentsMap: Record<string, TaskComment[]>,
  ): Promise<BoardPerformanceEvaluation> {
    const completed = tasks.filter((t) => t.status === "done");
    const late = tasks.filter((t) =>
      t.dueDate && t.completedAt
        ? new Date(t.completedAt) > new Date(t.dueDate)
        : !t.completedAt && !!t.dueDate,
    );
    const allRejections = Object.values(commentsMap)
      .flat()
      .filter((c) => c.type === "rejection");

    const taskSummaries: BoardTaskSummary[] = tasks.map((t) => {
      const taskComments = commentsMap[t.id] ?? [];
      const rejCount = taskComments.filter(
        (c) => c.type === "rejection",
      ).length;
      const wasLate =
        t.dueDate && t.completedAt
          ? new Date(t.completedAt) > new Date(t.dueDate)
          : !t.completedAt && !!t.dueDate;

      return {
        taskId: t.id,
        taskTitle: t.title,
        status: t.status,
        wasLate: !!wasLate,
        overallScore: 0,
        rejectionCount: rejCount,
      };
    });

    const tasksContext = tasks
      .map((t) => buildTaskContext(t, commentsMap[t.id] ?? []))
      .join("\n\n---\n\n");

    const prompt = buildBoardPrompt(boardTitle, tasksContext, taskSummaries);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: koreFlowConfig,
    });

    const clean = (response.text ?? "")
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch {
      throw new Error("O modelo não devolveu JSON válido para o board.");
    }

    const averageScore =
      taskSummaries.length > 0
        ? Math.round(
            taskSummaries.reduce((acc, t) => acc + t.overallScore, 0) /
              taskSummaries.length,
          )
        : 0;

    const evaluation: BoardPerformanceEvaluation = {
      boardId,
      boardTitle,
      evaluatedAt: new Date().toISOString(),
      stats: {
        totalTasks: tasks.length,
        completedTasks: completed.length,
        lateTasks: late.length,
        totalRejections: allRejections.length,
        completionRate:
          tasks.length > 0
            ? Math.round((completed.length / tasks.length) * 100)
            : 0,
        onTimeRate:
          tasks.length > 0
            ? Math.round(((tasks.length - late.length) / tasks.length) * 100)
            : 0,
        averageTaskScore: averageScore,
      },
      taskSummaries,
      memberSummaries: parsed.memberSummaries,
      overallScore: parsed.overallScore,
      overallSummary: parsed.overallSummary,
      recommendation: parsed.recommendation,
      highlights: parsed.highlights,
      concerns: parsed.concerns,
    };

    await setDoc(doc(db, "board_evaluations", boardId), {
      ...evaluation,
      savedAt: serverTimestamp(),
    });

    return evaluation;
  },
};
