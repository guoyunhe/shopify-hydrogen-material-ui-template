import { Box, Button } from '@mui/material';
import { useShop } from '@shopify/hydrogen-react';
import { NavLink } from 'react-router-dom';

export function DesktopMenu() {
  const menu: any[] = [];
  const shop = useShop();

  return (
    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      {menu?.items?.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(shop.storeDomain)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <Button key={item.id} color="inherit" component={NavLink} to={url}>
            {item.title}
          </Button>
        );
      })}
    </Box>
  );
}
