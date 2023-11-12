import { CircularProgress, CssBaseline } from '@mui/material';
import { CartProvider, ShopifyProvider } from '@shopify/hydrogen-react';
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
      <ShopifyProvider
        storeDomain={import.meta.env.VITE_PUBLIC_STORE_DOMAIN}
        storefrontToken={import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN}
        storefrontApiVersion="2023-10"
        countryIsoCode="US"
        languageIsoCode="EN"
      >
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
