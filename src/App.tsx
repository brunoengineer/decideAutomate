import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

// Define our own question types inline
type Option = {
  id: string;
  text: string;
  points: number;
};

type Question = {
  id: string;
  text: string;
  options: Option[];
};


// Define questions inline
const questions: Question[] = [
  {
    id: 'q1',
    text: 'Is the test going to be repeated?',
    options: [
      { id: 'q1_a1', text: 'Every build', points: 3 },
      { id: 'q1_a2', text: 'Every sprint', points: 1 },
      { id: 'q1_a3', text: 'Every major release', points: 0 },
      { id: 'q1_a4', text: 'Only this release', points: -1 }
    ]
  },
  {
    id: 'q2',
    text: 'Is it a Regression or Smoke test?',
    options: [
      { id: 'q2_a1', text: 'Smoke', points: 2 },
      { id: 'q2_a2', text: 'Regression', points: 1 },
      { id: 'q2_a3', text: 'Neither', points: 0 }
    ]
  },
  {
    id: 'q3',
    text: 'Is it a high-priority test?',
    options: [
      { id: 'q3_a1', text: 'High', points: 2 },
      { id: 'q3_a2', text: 'Medium', points: 1 },
      { id: 'q3_a3', text: 'Low', points: 0 }
    ]
  },
  {
    id: 'q4',
    text: 'Does this test functionality that is core to the value proposition of your application?',
    options: [
      { id: 'q4_a1', text: 'Yes', points: 2 },
      { id: 'q4_a2', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q5',
    text: 'Can you automate this with your existing tech stack?',
    options: [
      { id: 'q5_a1', text: 'Yes', points: 1 },
      { id: 'q5_a2', text: 'A tool exists and we have some experience, but not using it on this project yet', points: 0 },
      { id: 'q5_a3', text: 'No', points: -1 }
    ]
  },
  {
    id: 'q6',
    text: 'Do you need to run the test with multiple datasets or paths?',
    options: [
      { id: 'q6_a1', text: 'Yes', points: 1 },
      { id: 'q6_a2', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q7',
    text: 'How long would this test take to run via automation?',
    options: [
      { id: 'q7_a1', text: 'Relatively quickly (e.g., unit test)', points: 1 },
      { id: 'q7_a2', text: 'Average (e.g., integration test)', points: 0 },
      { id: 'q7_a3', text: 'Pretty long (i.e., E2E test)', points: -1 }
    ]
  },
  {
    id: 'q8',
    text: 'Does this test for usability, layout, look, or feel?',
    options: [
      { id: 'q8_a1', text: 'Yes', points: -5 },
      { id: 'q8_a2', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q9',
    text: 'Is the code being tested trivial?',
    options: [
      { id: 'q9_a1', text: 'Yes', points: -1 },
      { id: 'q9_a2', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q10',
    text: 'Is the area of your app that this is testing prone to change?',
    options: [
      { id: 'q10_a1', text: 'No', points: 0 },
      { id: 'q10_a2', text: 'Some changes', points: -1 },
      { id: 'q10_a3', text: 'Frequent changes', points: -2 }
    ]
  },
  {
    id: 'q11',
    text: 'Is it a Random Negative Test?',
    options: [
      { id: 'q11_a1', text: 'Yes', points: -1 },
      { id: 'q11_a2', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q12',
    text: 'Does this test rely on timing of certain interactions/responses? (e.g., load time, pop-ups)',
    options: [
      { id: 'q12_a1', text: 'Yes', points: -2 },
      { id: 'q12_a2', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q13',
    text: 'Can these tests be executed in parallel, or only in sequential order?',
    options: [
      { id: 'q13_a1', text: 'Yes, can be run in parallel', points: 0 },
      { id: 'q13_a2', text: 'No, must run sequentially', points: -2 }
    ]
  },
  {
    id: 'q14',
    text: 'Does this test require integration with other systems?',
    options: [
      { id: 'q14_a1', text: 'No', points: 1 },
      { id: 'q14_a2', text: 'Yes, but there is a service we can use to mock the other system', points: 0 },
      { id: 'q14_a3', text: 'Yes, but we have to set up a staging/testing instance', points: -2 },
      { id: 'q14_a4', text: 'Yes, and it can only be tested in production', points: -3 }
    ]
  },
  {
    id: 'q15',
    text: 'How expensive/complicated is the architecture required for this test?',
    options: [
      { id: 'q15_a1', text: 'Can run independently on its own or in CI/CD pipeline', points: 0 },
      { id: 'q15_a2', text: 'Requires additional services to be online', points: -2 }
    ]
  },
  {
    id: 'q16',
    text: 'Do you have a plan and dedicated resources to maintain the automation?',
    options: [
      { id: 'q16_a1', text: 'Yes, we have a plan and dedicated resources', points: 2 },
      { id: 'q16_a2', text: 'We have dedicated resources, but no plan', points: 1 },
      { id: 'q16_a3', text: 'We have a plan, but no dedicated resources', points: 0 },
      { id: 'q16_a4', text: 'We don\'t have a plan or dedicated resources', points: -1 }
    ]
  }
];

function WelcomePage() {
  const [testName, setTestName] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const handleStartAssessment = () => {
    if (!testName.trim()) {
      setError('Please enter a test name to continue');
      return;
    }
    
    // Store test name in localStorage
    localStorage.setItem('testName', testName);
    navigate('/questions');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Automation Assessment</h1>
      <p className="mb-6">References: <a href="https://github.com/brunoengineer/decideAutomate" className="text-blue-600 underline" target="_blank">GitHub Repository</a></p>
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome</h2>
        <p className="mb-6">This tool will help you decide whether a test should be automated based on a series of criteria questions.</p>
        
        <div className="mb-6">
          <label htmlFor="testName" className="block text-lg font-medium text-gray-800 mb-2 ml-1">Test Name</label>
          <div className="max-w-lg">
            <input 
              type="text" 
              id="testName" 
              className="p-2 border border-gray-300 rounded-md text-lg ml-1 w-[400px] max-w-full sm:w-[280px]" 
              style={{ height: '40px', width: '400px', maxWidth: '100%' }}
              placeholder="Enter the name of the test you want to assess"
              value={testName}
              onChange={(e) => {
                setTestName(e.target.value);
                if (error) setError('');
              }}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        </div>
        
        <button 
          className="btn btn-primary text-lg py-3 px-6"
          onClick={handleStartAssessment}
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}

function WizardPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{id: string, points: number}[]>([]);
  const [testName, setTestName] = useState('');
  
  const navigate = useNavigate();
  
  // Load test name from localStorage on component mount
  useEffect(() => {
    const savedTestName = localStorage.getItem('testName');
    if (!savedTestName) {
      // If no test name is found, redirect to welcome page
      navigate('/');
      return;
    }
    setTestName(savedTestName);
  }, [navigate]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (_optionId: string, points: number) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.id === currentQuestion.id);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { id: currentQuestion.id, points };
    } else {
      newAnswers.push({ id: currentQuestion.id, points });
    }
    
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If we're on the last question, navigate to results with answers and test name as URL parameters
      const answersParam = encodeURIComponent(JSON.stringify(answers));
      const testNameParam = encodeURIComponent(testName);
      navigate(`/results?answers=${answersParam}&testName=${testNameParam}`);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Find if current question has been answered
  const currentAnswer = answers.find(a => a.id === currentQuestion.id);
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Automation Decision Criteria</h1>
      
      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Total Questions: {questions.length}</span>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <div 
              key={option.id}
              className={`p-3 border rounded-md cursor-pointer ${currentAnswer && currentAnswer.points === option.points ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50 border-gray-200'}`}
              onClick={() => handleOptionSelect(option.id, option.points)}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <span>{option.text}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!currentAnswer}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

function ResultsPage() {
  const navigate = useNavigate();
  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const answersParam = searchParams.get('answers');
  const testNameParam = searchParams.get('testName');
  
  // Parse answers from URL parameter
  const answers = answersParam ? JSON.parse(decodeURIComponent(answersParam)) : [];
  const testName = testNameParam ? decodeURIComponent(testNameParam) : 'Unnamed Test';
  
  // Calculate total score
  const totalScore = answers.reduce((sum: number, answer: {id: string, points: number}) => sum + answer.points, 0);
  
  // Determine recommendation based on score
  const getRecommendation = () => {
    if (totalScore >= 7) {
      return {
        text: 'Automate it',
        description: 'This test is a great candidate for automation. The benefits clearly outweigh the costs.',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    } else if (totalScore >= 3) {
      return {
        text: 'Automate if you have free time',
        description: 'This test could benefit from automation, but it\'s not a high priority.',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      };
    } else if (totalScore >= 0) {
      return {
        text: 'You probably shouldn\'t automate this',
        description: 'The cost of automating this test likely outweighs the benefits.',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800'
      };
    } else {
      return {
        text: 'Do not Automate this',
        description: 'This test is not suitable for automation.',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    }
  };
  
  const recommendation = getRecommendation();
  
  // Get answer details for summary table
  const getAnswerDetails = (answerId: string, points: number) => {
    const question = questions.find(q => q.id === answerId);
    if (!question) return { questionText: 'Unknown question', optionText: 'Unknown option' };
    
    const option = question.options.find(o => o.points === points);
    return {
      questionText: question.text,
      optionText: option ? option.text : 'Unknown option'
    };
  };
  
  const handleStartNew = () => {
    // Clear test name from localStorage
    localStorage.removeItem('testName');
    navigate('/');
  };
  
  const handleDownloadPDF = () => {
    // Create PDF document in landscape mode for more space
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title with test name
    doc.setFontSize(16);
    doc.text(`Test Automation Assessment Results for: ${testName}`, 14, 15);
    
    // Add recommendation
    doc.setFontSize(12);
    doc.text(`Recommendation: ${recommendation.text}`, 14, 25);
    
    // Split long description into multiple lines if needed
    const descriptionLines = doc.splitTextToSize(recommendation.description, 250);
    doc.text(descriptionLines, 14, 32);
    
    doc.text(`Total Score: ${totalScore} points`, 14, 39 + (descriptionLines.length - 1) * 4);
    
    // Add simple table header
    let yPosition = 45 + (descriptionLines.length - 1) * 4;
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.rect(14, yPosition, 100, 8, 'F');
    doc.rect(114, yPosition, 120, 8, 'F');
    doc.rect(234, yPosition, 30, 8, 'F');
    doc.text('Question', 16, yPosition + 5.5);
    doc.text('Answer', 116, yPosition + 5.5);
    doc.text('Points', 236, yPosition + 5.5);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add table rows
    yPosition += 8;
    let isEvenRow = true;
    
    answers.forEach((answer: {id: string, points: number}) => {
      const details = getAnswerDetails(answer.id, answer.points);
      
      // Split question text if needed
      const questionLines = doc.splitTextToSize(details.questionText, 98);
      const answerLines = doc.splitTextToSize(details.optionText, 118);
      
      // Determine how many lines we need for this row
      const maxLines = Math.max(questionLines.length, answerLines.length);
      const rowHeight = maxLines * 4 + 2;
      
      // Draw cell backgrounds if even row
      if (isEvenRow) {
        doc.setFillColor(240, 240, 240);
        doc.rect(14, yPosition, 100, rowHeight, 'F');
        doc.rect(114, yPosition, 120, rowHeight, 'F');
        doc.rect(234, yPosition, 30, rowHeight, 'F');
      }
      
      // Add text
      doc.text(questionLines, 16, yPosition + 4);
      doc.text(answerLines, 116, yPosition + 4);
      
      // Set color for points
      if (answer.points > 0) {
        doc.setTextColor(22, 163, 74); // Green
      } else if (answer.points < 0) {
        doc.setTextColor(220, 38, 38); // Red
      }
      
      doc.text(
        answer.points > 0 ? `+${answer.points}` : `${answer.points}`, 
        246, 
        yPosition + 4
      );
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Update position for next row
      yPosition += rowHeight;
      isEvenRow = !isEvenRow;
    });
    
    // Add total row
    doc.setFillColor(240, 240, 240);
    doc.rect(14, yPosition, 100, 8, 'F');
    doc.rect(114, yPosition, 120, 8, 'F');
    doc.rect(234, yPosition, 30, 8, 'F');
    
    // Set font to bold
    doc.setFont('helvetica', 'bold');
    doc.text('Total', 16, yPosition + 5.5);
    
    // Set color for total points
    if (totalScore > 0) {
      doc.setTextColor(22, 163, 74); // Green
    } else if (totalScore < 0) {
      doc.setTextColor(220, 38, 38); // Red
    }
    
    doc.text(`${totalScore}`, 246, yPosition + 5.5);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, doc.internal.pageSize.height - 10);
    
    // Save the PDF
    doc.save(`automation-assessment-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  const handleDownloadJSON = () => {
    // Create JSON content
    const jsonData = {
      testName,
      answers: answers.map((answer: {id: string, points: number}) => {
        const details = getAnswerDetails(answer.id, answer.points);
        return {
          question: details.questionText,
          answer: details.optionText,
          points: answer.points
        };
      }),
      totalScore,
      recommendation: recommendation.text,
      description: recommendation.description,
      date: new Date().toISOString()
    };
    
    // Create and download the file
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `automation-assessment-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadCSV = () => {
    // Create CSV content
    let csvContent = `Test Name,"${testName}"\n\n`;
    csvContent += 'Question,Answer,Points\n';
    
    answers.forEach((answer: {id: string, points: number}) => {
      const details = getAnswerDetails(answer.id, answer.points);
      csvContent += `"${details.questionText}","${details.optionText}",${answer.points}\n`;
    });
    
    csvContent += `\nTotal Score,,${totalScore}\n`;
    csvContent += `Recommendation,"${recommendation.text}",\n`;
    csvContent += `Description,"${recommendation.description}",`;
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `automation-assessment-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Test Automation Assessment Results</h1>
      <h2 className="text-xl mb-6">Test Name: {testName}</h2>
      
      <div className={`card mb-6 border ${recommendation.bgColor} ${recommendation.textColor}`}>
        <h2 className="text-2xl font-bold mb-2">Recommendation</h2>
        <p className="text-xl mb-2">{recommendation.text}</p>
        <p>{recommendation.description}</p>
        <p className="mt-4 font-semibold">Total Score: {totalScore} points</p>
      </div>
      
      <div className="card mb-6">
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
              {answers.map((answer: {id: string, points: number}) => {
                const details = getAnswerDetails(answer.id, answer.points);
                return (
                  <tr key={answer.id}>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                      {details.questionText}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                      {details.optionText}
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
                  totalScore > 0 
                    ? 'text-green-600' 
                    : totalScore < 0 
                    ? 'text-red-600' 
                    : 'text-gray-900'
                }`}>
                  {totalScore}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-6">
        <div className="flex gap-3">
          <button
            className="btn bg-green-600 text-white hover:bg-green-700 flex items-center"
            onClick={handleDownloadCSV}
          >
            Download CSV Report
          </button>
          
          <button
            className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center"
            onClick={handleDownloadJSON}
          >
            Download JSON Report
          </button>
          
          <button
            className="btn bg-red-600 text-white hover:bg-red-700 flex items-center"
            onClick={handleDownloadPDF}
          >
            Download PDF Report
          </button>
        </div>
        
        <button
          className="btn btn-secondary ml-auto"
          onClick={handleStartNew}
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}

// Use basename for GitHub Pages
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />
  },
  {
    path: '/questions',
    element: <WizardPage />
  },
  {
    path: '/results',
    element: <ResultsPage />
  }
], {
  basename: '/decideAutomate'
});

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
