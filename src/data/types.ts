export interface Option {
  id: string;
  text: string;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface Answer {
  questionId: string;
  optionId: string;
  points: number;
}

export interface Report {
  answers: Answer[];
  totalScore: number;
  recommendation: string;
  recommendationLevel: 'automate' | 'automate_if_time' | 'probably_not' | 'do_not';
  date: string;
}

export type RecommendationLevel = 'automate' | 'automate_if_time' | 'probably_not' | 'do_not';

export interface RecommendationThreshold {
  level: RecommendationLevel;
  minScore: number;
  text: string;
}
