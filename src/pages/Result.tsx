import React from 'react';
import { useQuizStore } from '../data/store';
import Summary from '../components/Summary';
import DownloadReport from '../components/DownloadReport';
import { useNavigate } from 'react-router-dom';

const Result: React.FC = () => {
  const { report, resetQuiz } = useQuizStore();
  const navigate = useNavigate();
  
  // If no report is available, redirect to the wizard
  React.useEffect(() => {
    if (!report) {
      navigate('/');
    }
  }, [report, navigate]);
  
  if (!report) {
    return null;
  }
  
  const handleStartNew = () => {
    resetQuiz();
    navigate('/');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Automation Assessment Results</h1>
      
      <Summary />
      
      <div className="mt-8 flex flex-wrap gap-4">
        <DownloadReport />
        
        <button
          className="btn btn-secondary ml-auto"
          onClick={handleStartNew}
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

export default Result;
