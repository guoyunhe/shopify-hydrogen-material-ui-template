import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import { json, type LoaderFunctionArgs } from '@netlify/remix-runtime';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, Pagination, getPaginationVariables } from '@shopify/hydrogen';
import type { ArticleItemFragment } from 'storefrontapi.generated';
import blogImage1 from '~/images/blog-1.jpg';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.blog.title ?? ''} blog` }];
};

export const loader = async ({
  request,
  params,
  context: { storefront },
}: LoaderFunctionArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, { status: 404 });
  }

  const { blog } = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      ...paginationVariables,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', { status: 404 });
  }

  return json({ blog });
};

export default function Blog() {
  const { blog } = useLoaderData<typeof loader>();
  const { articles } = blog;

  return (
    <Box>
      <Container maxWidth="md">
        <Typography variant="h1" mt={4} mb={3}>
          {blog.title}
        </Typography>
        <Box>
          <Pagination connection={articles}>
            {({ nodes, isLoading, PreviousLink, NextLink }) => {
              return (
                <>
                  <PreviousLink>
                    {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                  </PreviousLink>
                  {nodes.map((article, index) => {
                    return (
                      <ArticleItem
                        article={article}
                        key={article.id}
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                    );
                  })}
                  <NextLink>
                    {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                  </NextLink>
                </>
              );
            }}
          </Pagination>
        </Box>
      </Container>
    </Box>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <Card key={article.id} variant="outlined" sx={{ my: 3 }}>
      <CardActionArea
        component={Link}
        to={`/blogs/${article.blog.handle}/${article.handle}`}
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        {article.image ? (
          <CardMedia
            component={Image}
            alt={article.image.altText || article.title}
            aspectRatio="3/2"
            data={article.image}
            loading={loading}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <CardMedia
            component="img"
            image={blogImage1}
            sx={{ flex: '1 1 50%' }}
          />
        )}
        <Box sx={{ flex: '1 1 50%' }}>
          <CardHeader title={article.title} subheader={publishedAt} />
          <CardContent>
            <Typography>
              {article.contentHtml
                ?.replace(/<\/?[^>]+(>|$)/g, '')
                ?.substring(0, 400)}
              ...
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
