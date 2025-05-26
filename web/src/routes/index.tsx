import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { HomePage, ErrorPage, SettingsPage } from '../pages';
import { Layout, PrivateRoute } from '../components';

const router = createBrowserRouter([
  {
    path: '/',
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
            <HomePage />
          </Suspense>
        ),
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/settings',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <SettingsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default function () {
  return <RouterProvider router={router} />;
}
