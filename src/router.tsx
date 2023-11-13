import { RouteObject, createBrowserRouter } from 'react-router-dom';
import AppLayout from './layouts/app';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <div />,
    children: [
      {
        index: true,
        element: <div />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
