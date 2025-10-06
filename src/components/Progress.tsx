import React from 'react';
import { useQuizStore } from '../data/store';
import { questions } from '../data/questions';
import { calculateMaxPossibleScore, calculateMinPossibleScore, calculateProgressPercentage } from '../data/scoring';

const Progress: React.FC = () => {
  const { currentQuestionIndex, getTotalScore } = useQuizStore();
  
  const totalQuestions = questions.length;
  const currentScore = getTotalScore();
  
  const maxPossibleScore = calculateMaxPossibleScore(questions);
  const minPossibleScore = calculateMinPossibleScore(questions);
  
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
  const scorePercentage = calculateProgressPercentage(currentScore, minPossibleScore, maxPossibleScore);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm text-gray-600">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span>Score: {currentScore} points</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Score indicator */}
      <div className="mt-3">
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <span>Min: {minPossibleScore}</span>
          <span>Max: {maxPossibleScore}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 flex">
            <div className="h-full bg-red-400" style={{ width: '25%' }}></div>
            <div className="h-full bg-orange-400" style={{ width: '25%' }}></div>
            <div className="h-full bg-yellow-400" style={{ width: '25%' }}></div>
            <div className="h-full bg-green-400" style={{ width: '25%' }}></div>
          </div>
          <div 
            className="h-full bg-black opacity-70 rounded-full w-2 absolute top-0 transition-all duration-300 ease-out"
            style={{ left: `${scorePercentage}%`, transform: 'translateX(-50%)' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
