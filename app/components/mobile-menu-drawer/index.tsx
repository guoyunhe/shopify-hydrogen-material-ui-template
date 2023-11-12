import {Drawer, List, ListItemButton, ListItemText} from '@mui/material';
import {NavLink} from '@remix-run/react';
import {useEffect, useState} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';

export interface MobileMenuProps {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}

export function MobileMenu({menu, shop}: MobileMenuProps) {
  const {publicStoreDomain} = useRootLoaderData();

  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    window.addEventListener('menu-open', handleOpen);
    window.addEventListener('menu-close', handleClose);
    return () => {
      window.removeEventListener('menu-open', handleOpen);
      window.removeEventListener('menu-close', handleClose);
    };
  }, []);
  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <List sx={{width: 300}}>
        <ListItemButton
          component={NavLink}
          end
          onClick={close}
          prefetch="intent"
          to="/"
        >
          <ListItemText primary="Home" />
        </ListItemButton>
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
            <ListItemButton
              key={item.id}
              component={NavLink}
              prefetch="intent"
              to={url}
              end
              onClick={close}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
