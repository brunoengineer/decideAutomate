import { createBrowserRouter } from 'react-router-dom';
import Wizard from '../pages/Wizard';
import Result from '../pages/Result';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wizard />
  },
  {
    path: '/result',
    element: <Result />
  }
]);
