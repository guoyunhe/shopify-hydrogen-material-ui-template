import { ArrowForward } from '@mui/icons-material';
import {
  Box,
  Container,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { json, type LoaderFunctionArgs } from '@netlify/remix-runtime';
import { Link, useLoaderData } from '@remix-run/react';

export async function loader({ context }: LoaderFunctionArgs) {
  const data = await context.storefront.query(POLICIES_QUERY);
  const policies = Object.values(data.shop || {});

  if (!policies.length) {
    throw new Response('No policies found', { status: 404 });
  }

  return json({ policies });
}

export default function Policies() {
  const { policies } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Container maxWidth="sm">
        <Typography variant="h1" mt={4} mb={3}>
          Policies
        </Typography>
        <List disablePadding>
          {policies.map((policy) => {
            if (!policy) return null;
            return (
              <ListItemButton
                key={policy.id}
                divider
                disableGutters
                component={Link}
                to={`/policies/${policy.handle}`}
              >
                <ListItemText primary={policy.title} />
                <ListItemIcon>
                  <ArrowForward />
                </ListItemIcon>
              </ListItemButton>
            );
          })}
        </List>
      </Container>
    </Box>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
