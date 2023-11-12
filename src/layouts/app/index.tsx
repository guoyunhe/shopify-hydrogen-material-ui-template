import { Box } from '@mui/material';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import { CartDrawer } from '~/components/cart-drawer';
import { Footer } from '~/components/footer';
import { MobileMenu } from '~/components/mobile-menu-drawer';
import { Navbar } from '~/components/navbar';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function AppLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <Box>
      <CartDrawer cart={cart} />
      <MobileMenu menu={header.menu} shop={header.shop} />
      <Navbar header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <Footer />
    </Box>
  );
}
