import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@netlify/remix-runtime';
import { Link as RouterLink, useFetcher } from '@remix-run/react';

type ActionResponse = {
  error?: string;
  resetRequested?: boolean;
};

export async function loader({ context }: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { storefront } = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    if (!email) {
      throw new Error('Please provide an email.');
    }
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: { email },
    });

    return json({ resetRequested: true });
  } catch (error: unknown) {
    const resetRequested = false;
    if (error instanceof Error) {
      return json({ error: error.message, resetRequested }, { status: 400 });
    }
    return json({ error, resetRequested }, { status: 400 });
  }
}

export default function Recover() {
  const { Form, state, data } = useFetcher<ActionResponse>();

  return (
    <Box className="account-recover" my={4}>
      <Container maxWidth="xs">
        {data?.resetRequested ? (
          <>
            <Typography variant="h1">Request Sent.</Typography>
            <p>
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
            <br />
            <Link component={RouterLink} to="/account/login">
              Login <ArrowForwardIcon fontSize="inherit" sx={{ mb: -0.3 }} />
            </Link>
          </>
        ) : (
          <Form method="POST">
            <Stack direction="column" gap={2}>
              <Typography variant="h1">Forgot Password</Typography>
              <p>
                Enter the email address associated with your account to receive
                a link to reset your password.
              </p>
              <br />
              <TextField
                label="Email"
                aria-label="Email address"
                autoComplete="email"
                autoFocus
                id="email"
                name="email"
                placeholder="Email address"
                required
                type="email"
              />

              {data?.error && <Alert severity="error">{data.error}</Alert>}

              <LoadingButton
                type="submit"
                variant="contained"
                loading={state === 'submitting' || state === 'loading'}
              >
                Request Reset Link
              </LoadingButton>

              <Link component={RouterLink} to="/account/login">
                Login <ArrowForwardIcon fontSize="inherit" sx={{ mb: -0.3 }} />
              </Link>
            </Stack>
          </Form>
        )}
      </Container>
    </Box>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
