import { CircularProgress, CssBaseline } from '@mui/material';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import LanguageEffects from './components/language-effects';
import router from './router';

export default function App() {
  const { t } = useTranslation();
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
      <LanguageEffects />
      <RouterProvider router={router} />
    </Suspense>
  );
}
