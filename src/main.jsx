import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import App from './App.jsx';
import VerifyHuman from './Pages/VerifyHuman/VerifyHuman.jsx';
import { Plans } from './Pages/Plans/Plans.jsx';
import {NotFoundPage} from './Pages/NotFoundPage/NotFoundPage.jsx'
import HomePage from './Pages/HomePage/HomePage.jsx'


import './index.css';

const router = createBrowserRouter([
  {
    path: 'tvs-rsa/',
    element: <AppLayout />,
    children: [
      {
        path: 'tvs-rsa/',
        element: <HomePage />
      },
      {
        // path: '/Generate-Policy/:service/:engine_no/:dealer_id',
        path: 'tvs-rsa/Generate-Policy',

        element: <App />
      },
      {
        path: 'tvs-rsa/Generate-Policy/:service/:engine_no/:dealer_id/Verify-Human',
        element: <VerifyHuman />
      },
      {
        // path: '/Generate-Policy/:service/:engine_no/:dealer_id/PlansSelection',
        path: 'tvs-rsa/PlansSelection',

        element: <Plans />
      },
      {
        path: '*',
        element: < NotFoundPage/>
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
