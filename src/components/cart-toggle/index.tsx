import {
  ShoppingBag as ShoppingBagIcon,
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
} from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';
import { useCart } from '@shopify/hydrogen-react';

export function CartToggle() {
  const cart = useCart();
  const count = cart.totalQuantity || 0;
  return (
    <IconButton
      color="inherit"
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
