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
import {
  Link as RouterLink,
  useFetcher,
  type MetaFunction,
} from '@remix-run/react';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { session, storefront } = context;

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const { customerAccessTokenCreate } = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: { email, password },
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const { customerAccessToken } = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error }, { status: 400 });
  }
}

export default function Login() {
  const { Form, state, data } = useFetcher<ActionResponse>();

  return (
    <Box className="login" my={4}>
      <Container maxWidth="xs">
        <Form method="POST">
          <Stack direction="column" gap={2}>
            <Typography variant="h1">Login</Typography>
            <TextField
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              autoFocus
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              required
              fullWidth
            />
            {data?.error && <Alert severity="error">{data.error}</Alert>}
            <LoadingButton
              type="submit"
              variant="contained"
              loading={state === 'submitting' || state === 'loading'}
            >
              Login
            </LoadingButton>
            <Link component={RouterLink} to="/account/recover">
              Forgot password{' '}
              <ArrowForwardIcon fontSize="inherit" sx={{ mb: -0.3 }} />
            </Link>
            <Link component={RouterLink} to="/account/register">
              Register <ArrowForwardIcon fontSize="inherit" sx={{ mb: -0.3 }} />
            </Link>
          </Stack>
        </Form>
      </Container>
    </Box>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;
