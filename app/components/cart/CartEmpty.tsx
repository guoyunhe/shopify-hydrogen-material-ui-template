import {ArrowForward} from '@mui/icons-material';
import {Box, Button} from '@mui/material';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import cartEmptyImage from './cart-empty.jpg';

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <Box
      hidden={hidden}
      sx={{
        textAlign: 'center',
        p: 4,
      }}
    >
      <Box
        component="img"
        src={cartEmptyImage}
        width={800}
        height={600}
        sx={{maxWidth: '100%', height: 'auto'}}
      />
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Button
        onClick={() => {
          window.dispatchEvent(new Event('cart-close'));
        }}
        endIcon={<ArrowForward />}
      >
        Continue shopping
      </Button>
    </Box>
  );
}
