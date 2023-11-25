import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { json, type LoaderFunctionArgs } from '@netlify/remix-runtime';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, Pagination, getPaginationVariables } from '@shopify/hydrogen';
import type { CollectionFragment } from 'storefrontapi.generated';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | Collections` }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const { collections } = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({ collections });
}

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();

  return (
    <Box className="collections">
      <Container maxWidth="xl">
        <Typography variant="h1" mt={4} mb={3}>
          Collections
        </Typography>
        <Pagination connection={collections}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => (
            <div>
              <PreviousLink>
                <LoadingButton
                  loading={isLoading}
                  startIcon={<ArrowUpward />}
                  sx={{ my: 3 }}
                >
                  Load previous
                </LoadingButton>
              </PreviousLink>
              <CollectionsGrid collections={nodes} />
              <NextLink>
                <LoadingButton
                  loading={isLoading}
                  startIcon={<ArrowDownward />}
                  sx={{ my: 3 }}
                >
                  Load more
                </LoadingButton>
              </NextLink>
            </div>
          )}
        </Pagination>
      </Container>
    </Box>
  );
}

function CollectionsGrid({
  collections,
}: {
  collections: CollectionFragment[];
}) {
  return (
    <Grid container spacing={3}>
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </Grid>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Grid key={collection.id} item xs={12} sm={6} md={3}>
      <Card variant="outlined">
        <CardActionArea
          component={Link}
          to={`/collections/${collection.handle}`}
          prefetch="intent"
        >
          {collection?.image && (
            <CardMedia
              component={Image}
              alt={collection.image.altText || collection.title}
              aspectRatio="1/1"
              data={collection.image}
              loading={index < 3 ? 'eager' : undefined}
              style={{ width: '100%', height: 'auto' }}
            />
          )}
          <CardHeader title={collection.title} />
        </CardActionArea>
      </Card>
    </Grid>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
