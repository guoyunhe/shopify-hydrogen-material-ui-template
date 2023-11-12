import {Box, CircularProgress, Drawer} from '@mui/material';
import {Await} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartMain} from '../cart';

export interface CartDrawerProps {
  cart: Promise<CartApiQueryFragment | null>;
}

export function CartDrawer({cart}: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    window.addEventListener('cart-open', handleOpen);
    window.addEventListener('cart-close', handleClose);
    return () => {
      window.removeEventListener('cart-open', handleOpen);
      window.removeEventListener('cart-close', handleClose);
    };
  }, []);
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box sx={{width: 300}}>
        <Suspense fallback={<CircularProgress />}>
          <Await resolve={cart}>
            {(cart) => {
              return <CartMain cart={cart} layout="aside" />;
            }}
          </Await>
        </Suspense>
      </Box>
    </Drawer>
  );
}
