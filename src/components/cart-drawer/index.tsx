import { Box, Drawer } from '@mui/material';
import { useEffect, useState } from 'react';
import { CartMain } from '../cart-main';

export function CartDrawer() {
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
      <Box sx={{ width: 300 }}>
        <CartMain />;
      </Box>
    </Drawer>
  );
}
