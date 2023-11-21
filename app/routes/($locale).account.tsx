import { LoadingButton } from '@mui/lab';
import { Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import {
  json,
  redirect,
  type LoaderFunctionArgs,
} from '@netlify/remix-runtime';
import {
  NavLink,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import type { CustomerFragment } from 'storefrontapi.generated';

export function shouldRevalidate() {
  return true;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { session, storefront } = context;
  const { pathname } = new URL(request.url);
  const customerAccessToken = await session.get('customerAccessToken');
  const isLoggedIn = !!customerAccessToken?.accessToken;
  const isAccountHome = pathname === '/account' || pathname === '/account/';
  const isPrivateRoute =
    /^\/account\/(orders|orders\/.*|profile|addresses|addresses\/.*)$/.test(
      pathname,
    );

  if (!isLoggedIn) {
    if (isPrivateRoute || isAccountHome) {
      session.unset('customerAccessToken');
      return redirect('/account/login', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    } else {
      // public subroute such as /account/login...
      return json({
        isLoggedIn: false,
        isAccountHome,
        isPrivateRoute,
        customer: null,
      });
    }
  } else {
    // loggedIn, default redirect to the orders page
    if (isAccountHome) {
      return redirect('/account/orders');
    }
  }

  try {
    const { customer } = await storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return json(
      { isLoggedIn, isPrivateRoute, isAccountHome, customer },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('There was a problem loading account', error);
    session.unset('customerAccessToken');
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  }
}

export default function Acccount() {
  const { customer, isPrivateRoute, isAccountHome } =
    useLoaderData<typeof loader>();

  if (!isPrivateRoute && !isAccountHome) {
    return <Outlet context={{ customer }} />;
  }

  return (
    <AccountLayout customer={customer as CustomerFragment}>
      <br />
      <br />
      <Outlet context={{ customer }} />
    </AccountLayout>
  );
}

function AccountLayout({
  customer,
  children,
}: {
  customer: CustomerFragment;
  children: React.ReactNode;
}) {
  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <Box className="account" my={4}>
      <Container maxWidth="md">
        <Typography variant="h1">{heading}</Typography>
        <AccountMenu />
        {children}
      </Container>
    </Box>
  );
}

function AccountMenu() {
  const match = useLocation();

  return (
    <Toolbar disableGutters>
      <Tabs value={match?.pathname} component="nav" role="navigation">
        <Tab
          label="Orders"
          component={NavLink}
          to="/account/orders"
          value="/account/orders"
        />
        <Tab
          label="Profile"
          component={NavLink}
          to="/account/profile"
          value="/account/profile"
        />
        <Tab
          label="Addresses"
          component={NavLink}
          to="/account/addresses"
          value="/account/addresses"
        />
      </Tabs>
      <Box display="flex" flex="1 1 auto" />
      <Logout />
    </Toolbar>
  );
}

function Logout() {
  const { Form, state } = useFetcher();
  return (
    <Form method="POST" action="/account/logout">
      <LoadingButton
        variant="outlined"
        type="submit"
        loading={state === 'loading' || state === 'submitting'}
      >
        Logout
      </LoadingButton>
    </Form>
  );
}

export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    acceptsMarketing
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
    defaultAddress {
      ...Address
    }
    email
    firstName
    lastName
    numberOfOrders
    phone
  }
  fragment Address on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_QUERY = `#graphql
  query Customer(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
