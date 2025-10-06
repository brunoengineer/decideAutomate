import { Answer, RecommendationLevel, RecommendationThreshold } from './types';

// Recommendation thresholds based on total score
export const recommendationThresholds: RecommendationThreshold[] = [
  {
    level: 'automate',
    minScore: 8,
    text: 'Automate it'
  },
  {
    level: 'automate_if_time',
    minScore: 4,
    text: 'Automate if you have free time'
  },
  {
    level: 'probably_not',
    minScore: 0,
    text: 'You probably shouldn\'t automate this'
  },
  {
    level: 'do_not',
    minScore: Number.NEGATIVE_INFINITY,
    text: 'Do not Automate this'
  }
];

/**
 * Calculate the total score from all answers
 */
export const calculateTotalScore = (answers: Answer[]): number => {
  return answers.reduce((total, answer) => total + answer.points, 0);
};

/**
 * Get the recommendation based on the total score
 */
export const getRecommendation = (totalScore: number): RecommendationThreshold => {
  // Sort thresholds from highest to lowest
  const sortedThresholds = [...recommendationThresholds].sort(
    (a, b) => b.minScore - a.minScore
  );
  
  // Find the first threshold that the score meets or exceeds
  return sortedThresholds.find(threshold => totalScore >= threshold.minScore) || sortedThresholds[sortedThresholds.length - 1];
};

/**
 * Calculate the maximum possible score
 */
export const calculateMaxPossibleScore = (questions: { options: { points: number }[] }[]): number => {
  return questions.reduce((total, question) => {
    const maxPointsForQuestion = Math.max(...question.options.map(option => option.points));
    return total + maxPointsForQuestion;
  }, 0);
};

/**
 * Calculate the minimum possible score
 */
export const calculateMinPossibleScore = (questions: { options: { points: number }[] }[]): number => {
  return questions.reduce((total, question) => {
    const minPointsForQuestion = Math.min(...question.options.map(option => option.points));
    return total + minPointsForQuestion;
  }, 0);
};

/**
 * Calculate the progress percentage
 */
export const calculateProgressPercentage = (
  currentScore: number,
  minScore: number,
  maxScore: number
): number => {
  // Normalize the score between 0 and 100
  const normalizedScore = ((currentScore - minScore) / (maxScore - minScore)) * 100;
  return Math.max(0, Math.min(100, normalizedScore));
};
