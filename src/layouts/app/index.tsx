import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { CartDrawer } from '~/components/cart-drawer';
import { Footer } from '~/components/footer';
import { MobileMenu } from '~/components/mobile-menu-drawer';
import { Navbar } from '~/components/navbar';

export default function AppLayout() {
  return (
    <Box>
      <CartDrawer />
      <MobileMenu menu={[]} />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </Box>
  );
}
