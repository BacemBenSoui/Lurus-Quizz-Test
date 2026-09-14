export type QuestionPart = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuestionOption {
  key: string;
  label: string;
}

export interface Question {
  id: number; // 1 to 23
  part: QuestionPart;
  partTitle: string;
  type: 'single' | 'multiple';
  typeLabel: 'UNE SEULE RÉPONSE' | 'PLUSIEURS RÉPONSES';
  points: number;
  durationSeconds: number;
  durationLabel: string;
  question: string;
  subInstruction?: string;
  options: QuestionOption[];
  correctAnswers: string[];
  requiredCount?: number;
  explanation?: string;
}

export interface SectionInfo {
  part: QuestionPart;
  title: string;
  questionCount: number;
  points: number;
}

export interface AnswerRecord {
  questionId: number;
  selectedOptions: string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeTakenSeconds: number;
  timedOut: boolean;
  submittedAt: string;
}

export interface Participant {
  id: string;
  nom: string;
  prenom: string;
  secteur: string;
  reseau: string;
  email: string;
  registeredAt: string;
  lastActiveAt: string;
  currentQuestionIndex: number;
  completed: boolean;
  completedAt?: string;
  totalScore: number;
  answers: Record<number, AnswerRecord>;
}

export type QuizStatus = 'validated' | 'validated_with_support' | 'retake';

export interface SectionStat {
  part: QuestionPart;
  title: string;
  maxPoints: number;
  questionCount: number;
  averageScore: number;
  averagePercentage: number;
  respondentsCount: number;
}

export interface GroupStat {
  name: string;
  totalParticipants: number;
  total?: number;
  completedCount: number;
  completed?: number;
  inProgressCount: number;
  averageScore: number;
  averagePercentage: number;
  highestScore: number;
  lowestScore: number;
  validatedCount: number;
  supportCount: number;
  retakeCount: number;
  validationRate: number; // % validé (score >= 30)
  subGroups?: string[]; // e.g. for a network, the sectors included
}

export interface QuizResultSummary {
  participant: Participant;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  status: QuizStatus;
  statusLabel: string;
  sectionBreakdown: {
    part: QuestionPart;
    title: string;
    pointsEarned: number;
    maxPoints: number;
    correctCount: number;
    totalCount: number;
  }[];
}
