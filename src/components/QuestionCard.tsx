import React from 'react';
import type { Question, Option } from '../data/types';
import { useQuizStore } from '../data/store';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { getAnswerForQuestion, setAnswer } = useQuizStore();
  
  const selectedAnswer = getAnswerForQuestion(question.id);
  
  const handleOptionSelect = (option: Option) => {
    setAnswer(question.id, option.id, option.points);
  };
  
  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <div 
            key={option.id}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedAnswer?.optionId === option.id
                ? 'bg-blue-100 border-blue-500'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                selectedAnswer?.optionId === option.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer?.optionId === option.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="flex-1">
                <span>{option.text}</span>
              </div>
              <div className={`ml-2 px-2 py-1 rounded-md text-sm ${
                option.points > 0
                  ? 'bg-green-100 text-green-800'
                  : option.points < 0
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {option.points > 0 ? `+${option.points}` : option.points}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
