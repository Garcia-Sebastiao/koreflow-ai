export interface ParticipantEvaluation {
  userId: string;
  userName: string;
  role: "dev" | "qa" | "other";

  // Métricas de tempo
  timeToStart?: number; // horas entre criação e início (dev)
  deliveryTime?: number; // horas entre início e entrega para teste (dev)
  timeToTest?: number; // horas entre receber e iniciar teste (qa)
  totalCycleTime?: number; 

  rejectionCount: number; 
  rejectionReasons: string[]; 

  // Score e avaliação
  score: number; // 0-100
  rating: "excellent" | "good" | "average" | "poor";
  summary: string;
  strengths: string[]; 
  improvements: string[]; 
}

export interface TaskPerformanceEvaluation {
  taskId: string;
  taskTitle: string;
  evaluatedAt: string;

  timeline: {
    createdAt: string;
    startedAt?: string;
    deliveredAt?: string;
    testedAt?: string;
    completedAt?: string;
    dueDate?: string;
    wasLate: boolean;
    totalDuration?: number; 
  };

  participants: ParticipantEvaluation[];

  overallScore: number;
  overallSummary: string;
  recommendation: string;
}
