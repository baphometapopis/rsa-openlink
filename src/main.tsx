import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout';
import App from './App.jsx';
import VerifyHuman from './Pages/VerifyHuman/VerifyHuman';
import { Plans } from './Pages/Plans/Plans';
import {NotFoundPage} from './Pages/NotFoundPage/NotFoundPage'

import './index.css';

const router = createBrowserRouter([
  {
    path: '/Generate-Policy/:service/:engine_no/:dealer_id',
    element: <AppLayout />,
    children: [
      {
        path: '/Generate-Policy/:service/:engine_no/:dealer_id',
        element: <App />
      },
      {
        path: '/Generate-Policy/:service/:engine_no/:dealer_id/Verify-Human',
        element: <VerifyHuman />
      },
      {
        path: '/Generate-Policy/:service/:engine_no/:dealer_id/PlansSelection',
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
