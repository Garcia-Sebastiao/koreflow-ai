import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { Task, TaskComment } from "@/types/task.types";
import type { TaskPerformanceEvaluation } from "@/types/performance.types";
import { ai, koreFlowConfig, modelId } from "@/config/gemini.config";

function hoursBetween(from?: string, to?: string): number | undefined {
  if (!from || !to) return undefined;
  return Math.round(((new Date(to).getTime() - new Date(from).getTime()) / 3600000) * 10) / 10;
}

function buildTaskContext(task: Task, comments: TaskComment[]): string {
  const rejections = comments.filter((c) => c.type === "rejection");
  const regular = comments.filter((c) => c.type === "comment");

  return `
=== TAREFA ===
ID: ${task.id}
Título: ${task.title}
Descrição: ${task.description ?? "Sem descrição"}
Prioridade: ${task.priority}
Status actual: ${task.status}
Responsável: ${task.assignee?.name ?? "Não atribuído"}

=== LINHA DO TEMPO ===
- Criada em: ${task.createdAt}
- Prazo: ${task.dueDate ?? "não definido"}
- Iniciada em: ${task.startedAt ?? "nunca"}
- Entregue para teste: ${task.deliveredAt ?? "nunca"}
- Início dos testes: ${task.testedAt ?? "nunca"}
- Concluída em: ${task.completedAt ?? "não concluída"}

=== HISTÓRICO DE MOVIMENTOS ===
${(task.statusHistory ?? []).map((e) => `  [${e.occurredAt}] ${e.byUserName}: "${e.fromStatus}" → "${e.toStatus}"`).join("\n") || "  Sem histórico."}

=== REPROVAÇÕES (${rejections.length}) ===
${rejections.length ? rejections.map((r) => `  - ${r.userName} (${r.createdAt}): "${r.content}"`).join("\n") : "  Nenhuma."}

=== COMENTÁRIOS (${regular.length}) ===
${regular.length ? regular.map((c) => `  - ${c.userName} (${c.createdAt}): "${c.content}"`).join("\n") : "  Nenhum."}
`.trim();
}

function buildPrompt(context: string): string {
  return `
És um especialista em análise de desempenho de equipas de software.
Analisa os dados abaixo e devolve APENAS JSON válido, sem markdown nem explicações.

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

Regras:
- Score 0-100. Dev: penaliza atrasos e reprovações. QA: penaliza lentidão nos testes e reprovações sem fundamento.
- wasLate = true se completedAt > dueDate ou se não concluída tendo prazo.
- Todos os tempos em horas. Textos em português de Portugal.
`.trim();
}

export const performanceService = {
  // ─── Carregar avaliação guardada ──────────────────────────────────
  async getEvaluation(taskId: string): Promise<TaskPerformanceEvaluation | null> {
    const snap = await getDoc(doc(db, "evaluations", taskId));
    if (!snap.exists()) return null;
    return snap.data() as TaskPerformanceEvaluation;
  },

  // ─── Gerar e guardar avaliação ────────────────────────────────────
  async evaluateTask(
    task: Task,
    comments: TaskComment[]
  ): Promise<TaskPerformanceEvaluation> {
    const context = buildTaskContext(task, comments);
    const prompt = buildPrompt(context);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: koreFlowConfig,
    });

    const raw = response.text?.trim() ?? "";
    const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        totalDuration: parsed.timeline.totalDuration ?? hoursBetween(task.createdAt, task.completedAt),
      },
      participants: parsed.participants,
      overallScore: parsed.overallScore,
      overallSummary: parsed.overallSummary,
      recommendation: parsed.recommendation,
    };

    // Guarda no Firestore (ID = taskId para fácil lookup)
    await setDoc(doc(db, "evaluations", task.id), {
      ...evaluation,
      savedAt: serverTimestamp(),
    });

    return evaluation;
  },
};