import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Answer, Report } from './types';
import { questions } from './questions';
import { calculateTotalScore, getRecommendation } from './scoring';

interface QuizState {
  currentQuestionIndex: number;
  answers: Answer[];
  report: Report | null;
  
  // Actions
  setAnswer: (questionId: string, optionId: string, points: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  generateReport: () => void;
  resetQuiz: () => void;
  
  // Computed
  getCurrentQuestion: () => typeof questions[0] | undefined;
  getAnswerForQuestion: (questionId: string) => Answer | undefined;
  getTotalScore: () => number;
  isQuizComplete: () => boolean;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuestionIndex: 0,
      answers: [],
      report: null,
      
      setAnswer: (questionId, optionId, points) => {
        set(state => {
          // Check if we already have an answer for this question
          const existingAnswerIndex = state.answers.findIndex(a => a.questionId === questionId);
          
          if (existingAnswerIndex >= 0) {
            // Update existing answer
            const updatedAnswers = [...state.answers];
            updatedAnswers[existingAnswerIndex] = { questionId, optionId, points };
            return { answers: updatedAnswers };
          } else {
            // Add new answer
            return { answers: [...state.answers, { questionId, optionId, points }] };
          }
        });
      },
      
      nextQuestion: () => {
        set(state => {
          if (state.currentQuestionIndex < questions.length - 1) {
            return { currentQuestionIndex: state.currentQuestionIndex + 1 };
          }
          return state;
        });
      },
      
      previousQuestion: () => {
        set(state => {
          if (state.currentQuestionIndex > 0) {
            return { currentQuestionIndex: state.currentQuestionIndex - 1 };
          }
          return state;
        });
      },
      
      goToQuestion: (index) => {
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },
      
      generateReport: () => {
        const answers = get().answers;
        const totalScore = calculateTotalScore(answers);
        const recommendation = getRecommendation(totalScore);
        
        const report: Report = {
          answers,
          totalScore,
          recommendation: recommendation.text,
          recommendationLevel: recommendation.level,
          date: new Date().toISOString()
        };
        
        set({ report });
      },
      
      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: [],
          report: null
        });
      },
      
      getCurrentQuestion: () => {
        return questions[get().currentQuestionIndex];
      },
      
      getAnswerForQuestion: (questionId) => {
        return get().answers.find(answer => answer.questionId === questionId);
      },
      
      getTotalScore: () => {
        return calculateTotalScore(get().answers);
      },
      
      isQuizComplete: () => {
        // Quiz is complete if we have answers for all questions
        return get().answers.length === questions.length;
      }
    }),
    {
      name: 'automation-decision-quiz',
      // Only persist these fields
      partialize: (state) => ({
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        report: state.report
      })
    }
  )
);
