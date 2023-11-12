import { Box } from '@mui/material';
import { useShop } from '@shopify/hydrogen-react';
import { NavLink } from 'react-router-dom';

export function Footer() {
  const shop = useShop();
  // TODO graph query
  return (
    <Box component="footer" className="footer">
      <Box component="nav" className="footer-menu" role="navigation">
        {menu.items.map((item) => {
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url = item.url.includes(shop.storeDomain)
            ? new URL(item.url).pathname
            : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.title}
            </a>
          ) : (
            <NavLink end key={item.id} to={url}>
              {item.title}
            </NavLink>
          );
        })}
      </Box>
    </Box>
  );
}
