import type { Task, TaskComment } from "@/types/task.types";
import type { TaskPerformanceEvaluation } from "@/types/performance.types";
import { ai, koreFlowConfig, modelId } from "@/config/gemini.config";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hoursBetween(from?: string, to?: string): number | undefined {
  if (!from || !to) return undefined;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.round((diff / 1000 / 60 / 60) * 10) / 10;
}

function buildTaskContext(task: Task, comments: TaskComment[]): string {
  const rejections = comments.filter((c) => c.type === "rejection");
  const regularComments = comments.filter((c) => c.type === "comment");

  const timelineLines = [
    `- Criada em: ${task.createdAt}`,
    task.dueDate ? `- Prazo: ${task.dueDate}` : "- Prazo: não definido",
    task.startedAt ? `- Iniciada em: ${task.startedAt}` : "- Nunca iniciada",
    task.deliveredAt
      ? `- Entregue para teste em: ${task.deliveredAt}`
      : "- Nunca entregue para teste",
    task.testedAt
      ? `- Início dos testes em: ${task.testedAt}`
      : "- Nunca testada",
    task.completedAt
      ? `- Concluída em: ${task.completedAt}`
      : "- Não concluída",
  ].join("\n");

  const historyLines = (task.statusHistory ?? [])
    .map(
      (e) =>
        `  [${e.occurredAt}] ${e.byUserName} moveu de "${e.fromStatus}" → "${e.toStatus}"`,
    )
    .join("\n");

  const rejectionLines = rejections.length
    ? rejections
        .map((r) => `  - ${r.userName} (${r.createdAt}): "${r.content}"`)
        .join("\n")
    : "  Nenhuma reprovação.";

  const commentLines = regularComments.length
    ? regularComments
        .map((c) => `  - ${c.userName} (${c.createdAt}): "${c.content}"`)
        .join("\n")
    : "  Nenhum comentário.";

  return `
=== TAREFA ===
ID: ${task.id}
Título: ${task.title}
Descrição: ${task.description ?? "Sem descrição"}
Prioridade: ${task.priority}
Status actual: ${task.status}
Responsável: ${task.assignee?.name ?? "Não atribuído"}

=== LINHA DO TEMPO ===
${timelineLines}

=== HISTÓRICO DE MOVIMENTOS ===
${historyLines || "  Sem histórico."}

=== REPROVAÇÕES (${rejections.length}) ===
${rejectionLines}

=== COMENTÁRIOS (${regularComments.length}) ===
${commentLines}
`.trim();
}

function buildPrompt(context: string): string {
  return `
És um especialista em análise de desempenho de equipas de desenvolvimento de software.
Analisa os dados abaixo e devolve APENAS um JSON válido, sem markdown, sem explicações, sem blocos de código.

${context}

Devolve exactamente este JSON:
{
  "timeline": {
    "wasLate": boolean,
    "totalDuration": number | null
  },
  "participants": [
    {
      "userId": string,
      "userName": string,
      "role": "dev" | "qa" | "other",
      "timeToStart": number | null,
      "deliveryTime": number | null,
      "timeToTest": number | null,
      "totalCycleTime": number | null,
      "rejectionCount": number,
      "rejectionReasons": string[],
      "score": number,
      "rating": "excellent" | "good" | "average" | "poor",
      "summary": string,
      "strengths": string[],
      "improvements": string[]
    }
  ],
  "overallScore": number,
  "overallSummary": string,
  "recommendation": string
}

Regras de avaliação:
- Score de 0 a 100
- Dev: penaliza atrasos na entrega, reprovações múltiplas, tempo de início elevado
- QA: penaliza atrasos no início dos testes, reprovações sem justificativa clara
- Considera o prazo da tarefa (wasLate = true se completedAt > dueDate ou se não foi concluída)
- Usa os comentários e reprovações para contexto qualitativo
- summary, strengths, improvements e recommendation em português de Portugal
- Todos os tempos em horas
`.trim();
}

export const performanceService = {
  async evaluateTask(
    task: Task,
    comments: TaskComment[],
  ): Promise<TaskPerformanceEvaluation> {
    const context = buildTaskContext(task, comments);
    const prompt = buildPrompt(context);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: koreFlowConfig,
    });

    const raw = response.text?.trim() ?? "";

    // Remove possíveis blocos markdown caso o modelo os inclua
    const clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let parsed: Omit<
      TaskPerformanceEvaluation,
      "taskId" | "taskTitle" | "evaluatedAt" | "timeline"
    > & {
      timeline: { wasLate: boolean; totalDuration: number | null };
    };

    try {
      parsed = JSON.parse(clean);
    } catch {
      throw new Error("O modelo não devolveu um JSON válido.");
    }

    // Enriquece com dados locais calculados
    const wasLate =
      task.dueDate && task.completedAt
        ? new Date(task.completedAt) > new Date(task.dueDate)
        : !task.completedAt;

    return {
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
        wasLate: parsed.timeline.wasLate ?? !!wasLate,
        totalDuration:
          parsed.timeline.totalDuration ??
          hoursBetween(task.createdAt, task.completedAt),
      },
      participants: parsed.participants,
      overallScore: parsed.overallScore,
      overallSummary: parsed.overallSummary,
      recommendation: parsed.recommendation,
    };
  },
};
