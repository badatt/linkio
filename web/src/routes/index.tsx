import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from './Home';
//import LandingPage from './LandingPage';
import ErrorPage from './ErrorPage';
import Layout from '../components/Layout';

const router = createBrowserRouter([
  {
    path: '/app',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      /* {
        path: ':slug',
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <LandingPage />
              </Suspense>
            ),
          },
        ],
      }, */
    ],
  },
]);

export default function () {
  return <RouterProvider router={router} />;
}
