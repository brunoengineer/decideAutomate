import React from 'react';
import { useQuizStore } from '../data/store';
import QuestionCard from '../components/QuestionCard';
import Progress from '../components/Progress';
import WizardNav from '../components/WizardNav';
import { questions } from '../data/questions';

const Wizard: React.FC = () => {
  const { currentQuestionIndex } = useQuizStore();
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return <div className="text-center py-8">No questions available</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Automation Decision Criteria</h1>
      <Progress />
      <QuestionCard question={currentQuestion} />
      <WizardNav />
    </div>
  );
};

export default Wizard;
