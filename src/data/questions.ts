import { Question } from './types';

export const questions: Question[] = [
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
    text: 'Does this test for usability, layout, "look," or "feel"?',
    options: [
      { id: 'q8_a1', text: 'Yes', points: -5 },
      { id: 'q8_a2', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q9',
    text: 'Is the code being tested "trivial"?',
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
