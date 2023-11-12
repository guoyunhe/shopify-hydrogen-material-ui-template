/// <reference types="vite/client" />

// https://vitejs.dev/guide/env-and-mode.html

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_API_BASE_URL: string;

  readonly VITE_PUBLIC_STORE_DOMAIN: string;
  readonly VITE_PUBLIC_STOREFRONT_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
