import { CacheProvider } from '@emotion/react';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import createEmotionCache from './createEmotionCache';

export interface ClientStyleContextData {
  reset: () => void;
}

const ClientStyleContext = createContext<ClientStyleContextData>({
  reset: () => {},
});

export function useClientStyle() {
  return useContext(ClientStyleContext);
}

export interface ClientStyleProviderProps {
  children: ReactNode;
}

export function ClientStyleProvider({ children }: ClientStyleProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  const clientStyleContextValue = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    [],
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}
