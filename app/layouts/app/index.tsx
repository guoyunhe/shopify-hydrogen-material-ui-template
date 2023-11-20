import { Box, CssBaseline } from '@mui/material';
import { Await } from '@remix-run/react';
import { Suspense } from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import { CartDrawer } from '~/components/cart-drawer';
import { Footer } from '~/components/Footer';
import { MobileMenu } from '~/components/mobile-menu-drawer';
import { Navbar } from '~/components/navbar';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <CartDrawer cart={cart} />
      <MobileMenu menu={header.menu} shop={header.shop} />
      <Navbar header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <Box component="main" flex="1 1 auto">
        {children}
      </Box>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} shop={header.shop} />}
        </Await>
      </Suspense>
    </Box>
  );
}
