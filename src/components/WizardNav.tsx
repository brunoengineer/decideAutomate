import React from 'react';
import { useQuizStore } from '../data/store';
import { questions } from '../data/questions';
import { useNavigate } from 'react-router-dom';

const WizardNav: React.FC = () => {
  const { 
    currentQuestionIndex, 
    nextQuestion, 
    previousQuestion, 
    getAnswerForQuestion,
    isQuizComplete,
    generateReport
  } = useQuizStore();
  
  const navigate = useNavigate();
  
  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswer = currentQuestion ? !!getAnswerForQuestion(currentQuestion.id) : false;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  const handleNext = () => {
    if (isLastQuestion) {
      generateReport();
      navigate('/result');
    } else {
      nextQuestion();
    }
  };
  
  const handleComplete = () => {
    if (isQuizComplete()) {
      generateReport();
      navigate('/result');
    }
  };
  
  return (
    <div className="flex justify-between mt-6">
      <button
        className="btn btn-secondary"
        onClick={previousQuestion}
        disabled={isFirstQuestion}
      >
        Previous
      </button>
      
      <div className="flex gap-3">
        {isLastQuestion && isQuizComplete() && (
          <button
            className="btn bg-green-600 text-white hover:bg-green-700"
            onClick={handleComplete}
          >
            Complete
          </button>
        )}
        
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!hasAnswer}
        >
          {isLastQuestion ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default WizardNav;
