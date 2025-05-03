import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from './Home';
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
    ],
  },
]);

export default function () {
  return <RouterProvider router={router} />;
}
