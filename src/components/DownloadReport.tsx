import React from 'react';
import { useQuizStore } from '../data/store';
import { questions } from '../data/questions';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

const DownloadReport: React.FC = () => {
  const { report, answers } = useQuizStore();
  
  if (!report) {
    return null;
  }
  
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
  
  const generateFileName = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '').substring(0, 4);
    return `automation-assessment-${formattedDate}-${formattedTime}`;
  };
  
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title
    doc.setFontSize(20);
    doc.text('Automation Decision Assessment', 15, 15);
    
    // Add recommendation
    doc.setFontSize(16);
    doc.text('Recommendation:', 15, 25);
    doc.setFontSize(14);
    doc.text(report.recommendation, 15, 32);
    doc.text(`Total Score: ${report.totalScore} points`, 15, 39);
    doc.setFontSize(10);
    doc.text(`Assessment completed on ${formatDate(report.date)}`, 15, 45);
    
    // Add table with answers
    const tableData = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      return [
        question?.text || 'Unknown question',
        getOptionTextById(answer.questionId, answer.optionId),
        answer.points.toString()
      ];
    });
    
    // Add total row
    tableData.push(['Total', '', report.totalScore.toString()]);
    
    autoTable(doc, {
      startY: 55,
      head: [['Question', 'Answer', 'Points']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: 'bold'
      },
      foot: [['Total', '', report.totalScore.toString()]],
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20, halign: 'center' }
      }
    });
    
    doc.save(`${generateFileName()}.pdf`);
  };
  
  const downloadCSV = () => {
    const csvRows = [];
    
    // Add header row
    csvRows.push(['Question', 'Answer', 'Points']);
    
    // Add data rows
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      csvRows.push([
        question?.text || 'Unknown question',
        getOptionTextById(answer.questionId, answer.optionId),
        answer.points
      ]);
    });
    
    // Add total row
    csvRows.push(['Total', '', report.totalScore]);
    
    // Add recommendation
    csvRows.push([]);
    csvRows.push(['Recommendation', report.recommendation, '']);
    csvRows.push(['Date', formatDate(report.date), '']);
    
    // Convert to CSV string
    let csvContent = '';
    csvRows.forEach(row => {
      // Escape commas and quotes in cell values
      const escapedRow = row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${generateFileName()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadJSON = () => {
    const jsonData = {
      recommendation: report.recommendation,
      totalScore: report.totalScore,
      date: report.date,
      answers: answers.map(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        return {
          question: question?.text || 'Unknown question',
          answer: getOptionTextById(answer.questionId, answer.optionId),
          points: answer.points
        };
      })
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${generateFileName()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <button
  className="btn flex items-center !text-sm sm:!text-base bg-blue-600 text-white hover:bg-blue-700 py-2 px-3 sm:py-3 sm:px-6"
        onClick={downloadPDF}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
        Download PDF
      </button>
      
      <button
  className="btn flex items-center !text-sm sm:!text-base bg-green-600 text-white hover:bg-green-700 py-2 px-3 sm:py-3 sm:px-6"
        onClick={downloadCSV}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
        Download CSV
      </button>
      
      <button
  className="btn flex items-center !text-sm sm:!text-base bg-purple-600 text-white hover:bg-purple-700 py-2 px-3 sm:py-3 sm:px-6"
        onClick={downloadJSON}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
        Download JSON
      </button>
    </div>
  );
};

export default DownloadReport;
