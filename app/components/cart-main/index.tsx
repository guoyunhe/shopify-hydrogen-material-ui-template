import { ArrowForward } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  List,
  TextField,
  Typography,
} from '@mui/material';
import { CartForm, Money } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartEmpty } from '../cart-empty';
import { CartLine } from '../cart-line';

export interface CartMainProps {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
}

export function CartMain({ layout, cart }: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      {!linesCount && <CartEmpty />}
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({ layout, cart }: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <>
          <CartSummary cost={cart.cost} />
          <Divider />
          <CartDiscounts discountCodes={cart.discountCodes} />
          <Divider />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </>
      )}
    </div>
  );
}

function CartLines({
  lines,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <List>
        {lines.nodes.map((line) => (
          <CartLine key={line.id} line={line} />
        ))}
      </List>
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl: string }) {
  if (!checkoutUrl) return null;

  return (
    <Box p={2}>
      <Button
        endIcon={<ArrowForward />}
        variant="contained"
        component="a"
        href={checkoutUrl}
        target="_self"
      >
        Continue to Checkout
      </Button>
    </Box>
  );
}

export function CartSummary({ cost }: { cost: CartApiQueryFragment['cost'] }) {
  return (
    <Box p={2}>
      <Typography variant="h4">Totals:</Typography>
      <Typography color="primary">
        {cost?.subtotalAmount?.amount ? (
          <Money data={cost?.subtotalAmount} />
        ) : (
          '-'
        )}
      </Typography>
    </Box>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <Box p={2}>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <Box display="flex">
          <TextField
            type="text"
            name="discountCode"
            label="Discount code"
            sx={{ mr: 2 }}
            fullWidth
          />
          <Button variant="outlined" type="submit">
            Apply
          </Button>
        </Box>
      </UpdateDiscountForm>
    </Box>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
