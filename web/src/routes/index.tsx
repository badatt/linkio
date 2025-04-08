import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from './Home';
import LandingPage from './LandingPage';
import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        Layout
        <Outlet />
      </div>
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
      {
        path: ':slug',
        element: (
          <div>
            Landing Layout
            <Outlet />
          </div>
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
      },
    ],
  },
]);

export default function () {
  return <RouterProvider router={router} />;
}
