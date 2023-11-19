import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  IconButton,
  ListItem,
  Typography,
} from '@mui/material';
import { FetcherWithComponents, Link } from '@remix-run/react';
import { CartForm, Image, Money } from '@shopify/hydrogen';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/utils';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

export function CartLine({ line }: { line: CartLine }) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <ListItem key={id} className="cart-line" divider>
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            window.dispatchEvent(new Event('cart-close'));
          }}
        >
          <p>
            <strong>{product.title}</strong>
          </p>
        </Link>
        <CartLinePrice line={line} as="span" />
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.name}>
              <small>
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </ListItem>
  );
}

function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <Box
      className="cart-line-quantiy"
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <Typography>Quantity:</Typography>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <AddIcon />
      </CartLineUpdateButton>
      {quantity}
      <CartLineUpdateButton
        lines={[{ id: lineId, quantity: prevQuantity }]}
        disabled={quantity <= 1}
      >
        <RemoveIcon />
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} />
    </Box>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <Typography color="primary">
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </Typography>
  );
}

function CartLineRemoveButton({ lineIds }: { lineIds: string[] }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <IconButton
          color="error"
          type="submit"
          disabled={
            fetcher.state === 'submitting' || fetcher.state === 'loading'
          }
        >
          {fetcher.state === 'submitting' || fetcher.state === 'loading' ? (
            <CircularProgress size={24} />
          ) : (
            <DeleteIcon />
          )}
        </IconButton>
      )}
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
  disabled,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
  disabled?: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <IconButton
          color="primary"
          type="submit"
          disabled={disabled || fetcher.state === 'submitting'}
        >
          {fetcher.state === 'submitting' || fetcher.state === 'loading' ? (
            <CircularProgress size={24} />
          ) : (
            children
          )}
        </IconButton>
      )}
    </CartForm>
  );
}
