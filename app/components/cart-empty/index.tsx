import {ArrowForward} from '@mui/icons-material';
import {Box, Button} from '@mui/material';
import cartEmptyImage from './cart-empty.jpg';

export function CartEmpty() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        p: 3,
      }}
    >
      <Box
        component="img"
        src={cartEmptyImage}
        width={600}
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
