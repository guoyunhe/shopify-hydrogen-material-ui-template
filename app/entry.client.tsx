import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ClientStyleProvider } from './ClientStyleContext';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientStyleProvider>
        <RemixBrowser />
      </ClientStyleProvider>
    </StrictMode>,
  );
});
