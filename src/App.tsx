import { CircularProgress, CssBaseline } from '@mui/material';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

export default function App() {
  return (
    <Suspense
      fallback={
        <CircularProgress
          size={48}
          sx={{
            display: 'block',
            position: 'fixed',
            left: '50%',
            top: '50%',
            m: -3,
          }}
        />
      }
    >
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </Suspense>
  );
}
