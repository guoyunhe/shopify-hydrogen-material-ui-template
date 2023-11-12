import { createStorefrontClient } from '@shopify/hydrogen-react';

export const storefront = createStorefrontClient({
  storeDomain: import.meta.env.VITE_PUBLIC_STORE_DOMAIN,
  publicStorefrontToken: process.env.VITE_PUBLIC_STOREFRONT_API_TOKEN,
});
