import {
  ShoppingBag as ShoppingBagIcon,
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
} from '@mui/icons-material';
import {Badge, IconButton} from '@mui/material';
import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export function CartBadge({count}: {count: number}) {
  return (
    <IconButton
      color="inherit"
      edge="end"
      onClick={() => {
        window.dispatchEvent(new Event('cart-open'));
      }}
    >
      <Badge color="primary" badgeContent={count}>
        {count > 0 ? <ShoppingBagIcon /> : <ShoppingBagOutlinedIcon />}
      </Badge>
    </IconButton>
  );
}

export interface CartToggleProps {
  cart: Promise<CartApiQueryFragment | null>;
}

export function CartToggle({cart}: CartToggleProps) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => <CartBadge count={cart?.totalQuantity || 0} />}
      </Await>
    </Suspense>
  );
}
