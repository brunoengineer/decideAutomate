import React from 'react';
import { useQuizStore } from '../data/store';
import { questions } from '../data/questions';

const Summary: React.FC = () => {
  const { report, answers } = useQuizStore();
  
  if (!report) {
    return <div className="text-center py-8">No report available</div>;
  }
  
  const getRecommendationColor = () => {
    switch (report.recommendationLevel) {
      case 'automate':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'automate_if_time':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'probably_not':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'do_not':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getOptionTextById = (questionId: string, optionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return 'Unknown option';
    
    const option = question.options.find(o => o.id === optionId);
    return option ? option.text : 'Unknown option';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg border ${getRecommendationColor()}`}>
        <h2 className="text-2xl font-bold mb-2">Recommendation</h2>
        <p className="text-xl">{report.recommendation}</p>
        <p className="mt-2">Total Score: {report.totalScore} points</p>
        <p className="text-sm mt-1">Assessment completed on {formatDate(report.date)}</p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Question Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Answer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {answers.map((answer) => {
                const question = questions.find(q => q.id === answer.questionId);
                return (
                  <tr key={answer.questionId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question?.text || 'Unknown question'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getOptionTextById(answer.questionId, answer.optionId)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      answer.points > 0 
                        ? 'text-green-600' 
                        : answer.points < 0 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      {answer.points > 0 ? `+${answer.points}` : answer.points}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4"></td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                  report.totalScore > 0 
                    ? 'text-green-600' 
                    : report.totalScore < 0 
                    ? 'text-red-600' 
                    : 'text-gray-900'
                }`}>
                  {report.totalScore}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Summary;
