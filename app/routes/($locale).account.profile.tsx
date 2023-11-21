import { LoadingButton } from '@mui/lab';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@netlify/remix-runtime';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import type { CustomerUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CustomerFragment } from 'storefrontapi.generated';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Profile' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { session, storefront } = context;

  if (request.method !== 'PUT') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const form = await request.formData();
  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const password = getPassword(form);
    const customer: CustomerUpdateInput = {};
    const validInputKeys = [
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
    ] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (key === 'acceptsMarketing') {
        customer.acceptsMarketing = value === 'on';
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    if (password) {
      customer.password = password;
    }

    // update customer and possibly password
    const updated = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        customer,
      },
    });

    // check for mutation errors
    if (updated.customerUpdate?.customerUserErrors?.length) {
      return json(
        { error: updated.customerUpdate?.customerUserErrors[0] },
        { status: 400 },
      );
    }

    // update session with the updated access token
    if (updated.customerUpdate?.customerAccessToken?.accessToken) {
      session.set(
        'customerAccessToken',
        updated.customerUpdate?.customerAccessToken,
      );
    }

    return json(
      { error: null, customer: updated.customerUpdate?.customer },
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error: any) {
    return json({ error: error.message, customer: null }, { status: 400 });
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{ customer: CustomerFragment }>();
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <Box>
      <Form method="PUT">
        <Typography variant="h3" mb={3}>
          Personal information
        </Typography>
        <Stack direction="column" gap={2}>
          <TextField
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            label="First name"
            aria-label="First name"
            defaultValue={customer.firstName ?? ''}
          />
          <TextField
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            label="Last name"
            aria-label="Last name"
            defaultValue={customer.lastName ?? ''}
          />
          <TextField
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            label="Mobile"
            aria-label="Mobile"
            defaultValue={customer.phone ?? ''}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            label="Email"
            aria-label="Email"
            defaultValue={customer.email ?? ''}
          />
          <TextField
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            label="Current password"
            aria-label="Current password"
            required
          />
          <div className="account-profile-marketing">
            <input
              id="acceptsMarketing"
              name="acceptsMarketing"
              type="checkbox"
              placeholder="Accept marketing"
              aria-label="Accept marketing"
              defaultChecked={customer.acceptsMarketing}
            />
            <label htmlFor="acceptsMarketing">
              &nbsp; Subscribed to marketing communications
            </label>
          </div>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={state !== 'idle'}
          >
            Update
          </LoadingButton>
        </Stack>
      </Form>
      <Box mb={4} />
      <Form method="PUT">
        <Typography variant="h3" mb={3}>
          Change password
        </Typography>
        <Stack direction="column" gap={2}>
          <TextField
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            label="Current password"
            required
          />

          <TextField name="newPassword" type="password" label="New password" />

          <TextField
            id="newPasswordConfirm"
            name="newPasswordConfirm"
            type="password"
            label="New password (confirm)"
            aria-label="New password confirm"
          />
          <small>Passwords must be at least 8 characters.</small>
          {typeof action?.error === 'string' && (
            <Alert severity="error">{action.error}</Alert>
          )}
          <LoadingButton
            variant="contained"
            type="submit"
            loading={state !== 'idle'}
          >
            Update
          </LoadingButton>
        </Stack>
      </Form>
    </Box>
  );
}

function getPassword(form: FormData): string | undefined {
  let password;
  const currentPassword = form.get('currentPassword');
  const newPassword = form.get('newPassword');
  const newPasswordConfirm = form.get('newPasswordConfirm');

  let passwordError;
  if (newPassword && !currentPassword) {
    passwordError = new Error('Current password is required.');
  }

  if (newPassword && newPassword !== newPasswordConfirm) {
    passwordError = new Error('New passwords must match.');
  }

  if (newPassword && currentPassword && newPassword === currentPassword) {
    passwordError = new Error(
      'New password must be different than current password.',
    );
  }

  if (passwordError) {
    throw passwordError;
  }

  if (currentPassword && newPassword) {
    password = newPassword;
  } else {
    password = currentPassword;
  }

  return String(password);
}

const CUSTOMER_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/storefront/latest/mutations/customerUpdate
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        acceptsMarketing
        email
        firstName
        id
        lastName
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
