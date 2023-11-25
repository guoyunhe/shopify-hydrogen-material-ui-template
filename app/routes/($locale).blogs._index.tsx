import { Box, Container, Typography } from '@mui/material';
import { json, type LoaderFunctionArgs } from '@netlify/remix-runtime';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Pagination, getPaginationVariables } from '@shopify/hydrogen';

export const meta: MetaFunction = () => {
  return [{ title: `Hydrogen | Blogs` }];
};

export const loader = async ({
  request,
  context: { storefront },
}: LoaderFunctionArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const { blogs } = await storefront.query(BLOGS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  return json({ blogs });
};

export default function Blogs() {
  const { blogs } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Container maxWidth="md">
        <Typography variant="h1" mt={4} mb={3}>
          Blogs
        </Typography>
        <div className="blogs-grid">
          <Pagination connection={blogs}>
            {({ nodes, isLoading, PreviousLink, NextLink }) => {
              return (
                <>
                  <PreviousLink>
                    {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                  </PreviousLink>
                  {nodes.map((blog) => {
                    return (
                      <Link
                        className="blog"
                        key={blog.handle}
                        prefetch="intent"
                        to={`/blogs/${blog.handle}`}
                      >
                        <h2>{blog.title}</h2>
                      </Link>
                    );
                  })}
                  <NextLink>
                    {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                  </NextLink>
                </>
              );
            }}
          </Pagination>
        </div>
      </Container>
    </Box>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;
