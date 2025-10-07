## References

This project was inspired by and uses information from:

- [TestRail spreadsheet](https://docs.google.com/spreadsheets/d/12ilW5-WkQ-aWcXs--R-bYpe61x3auR5Mk2mtc4rRWtM/edit?gid=75059267#gid=75059267)
- [Martin Fowler: The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html#TheImportanceOftestAutomation)
- [TestRail Blog: How to Automate Test Cases](https://www.testrail.com/blog/automate-testcase/)
# Automation Decision Tool

A React application that helps QA engineers decide whether a test should be automated or not based on a series of criteria questions.

## Features

- Interactive questionnaire with 16 criteria questions
- Real-time scoring and progress tracking
- Detailed results with recommendation
- Report generation in PDF, CSV, and JSON formats
- Persistent state using localStorage
- Responsive design with Tailwind CSS
- End-to-end testing with Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/decideAutomate.git
cd decideAutomate

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Usage

1. Answer each question by selecting one of the provided options
2. Navigate through questions using the Next/Previous buttons
3. View your final score and recommendation
4. Download a report in your preferred format (PDF, CSV, JSON)
5. Start a new assessment if needed

## Scoring System

The application uses a point-based system where each answer contributes to the overall score. The final recommendation is based on the following thresholds:

- 8+ points: "Automate it"
- 4-7 points: "Automate if you have free time"
- 0-3 points: "You probably shouldn't automate this"
- Less than 0 points: "Do not Automate this"

## Testing

```bash
# Run Playwright tests
npm test

# View test report
npm run test:report
```

## Building for Production

```bash
npm run build
npm run preview
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Router
- jsPDF (PDF Generation)
- Playwright (Testing)

## License

MIT
