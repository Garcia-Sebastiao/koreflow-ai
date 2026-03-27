export interface ParticipantEvaluation {
  userId: string;
  userName: string;
  role: "dev" | "qa" | "other";
  timeToStart?: number;
  deliveryTime?: number;
  timeToTest?: number;
  totalCycleTime?: number;
  rejectionCount: number;
  rejectionReasons: string[];
  score: number;
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

export interface BoardMemberSummary {
  userId: string;
  userName: string;
  role: "dev" | "qa" | "other";
  tasksInvolved: number;
  averageScore: number;
  totalRejectionCount: number;
  averageDeliveryTime?: number;
  averageTimeToTest?: number;
  rating: "excellent" | "good" | "average" | "poor";
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface BoardTaskSummary {
  taskId: string;
  taskTitle: string;
  status: string;
  wasLate: boolean;
  overallScore: number;
  rejectionCount: number;
}

export interface BoardPerformanceEvaluation {
  id: string;          
  boardId: string;
  boardTitle: string;
  evaluatedAt: string;
  evaluationIndex: number;
  stats: {
    totalTasks: number;
    completedTasks: number;
    lateTasks: number;
    totalRejections: number;
    completionRate: number;
    onTimeRate: number;
    averageTaskScore: number;
  };

  taskSummaries: BoardTaskSummary[];
  memberSummaries: BoardMemberSummary[];
  overallScore: number;
  overallSummary: string;
  recommendation: string;
  highlights: string[];
  concerns: string[];
}