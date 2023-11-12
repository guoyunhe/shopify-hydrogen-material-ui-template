import {Box, Button} from '@mui/material';
import {NavLink} from '@remix-run/react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';

export interface DesktopMenuProps {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}

export function DesktopMenu({menu, shop}: DesktopMenuProps) {
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
      {menu?.items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(shop.primaryDomain.url)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <Button
            key={item.id}
            color="inherit"
            component={NavLink}
            prefetch="intent"
            to={url}
            end
          >
            {item.title}
          </Button>
        );
      })}
    </Box>
  );
}
