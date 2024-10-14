// import ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import AppLayout from './AppLayout.jsx';
// import App from './App.jsx';
// import VerifyHuman from './Pages/VerifyHuman/VerifyHuman.jsx';
// import { Plans } from './Pages/Plans/Plans.jsx';
// import {NotFoundPage} from './Pages/NotFoundPage/NotFoundPage.jsx'
// import HomePage from './Pages/HomePage/HomePage.jsx'


// import './index.css';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <AppLayout />,
//     children: [
//       {
//         path: '/:service/:dealer_id',
//         element: <HomePage />
//       },
//       {
//         // path: '/Generate-Policy/:service/:engine_no/:dealer_id',
//         path: '/Generate-Policy',

//         element: <App />
//       },
//       // {
//       //   path: '/Generate-Policy/:service/:engine_no/:dealer_id/Verify-Human',
//       //   element: <VerifyHuman />
//       // },
//       {
//         // path: '/Generate-Policy/:service/:engine_no/:dealer_id/PlansSelection',
//         path: '/PlansSelection',

//         element: <Plans />
//       },
//       {
//         path: '*',
//         element: < NotFoundPage/>
//       }
//     ]
//   },
//   {
//     path: '*',
//     element: <NotFoundPage />
//   }
// ]);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <RouterProvider router={router} />
// );
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout.jsx';
import App from './App.jsx';
import { Plans } from './Pages/Plans/Plans.jsx';
import { NotFoundPage } from './Pages/NotFoundPage/NotFoundPage.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/:service/:dealer_id',
        element: <HomePage />,
      },
      {
        path: '/Generate-Policy',
        element: <App />,
      },
      {
        path: '/PlansSelection',
        element: <Plans />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
