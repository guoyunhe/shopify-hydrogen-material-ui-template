import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { NavLink } from '@remix-run/react';
import { useState } from 'react';
import type {
  CartApiQueryFragment,
  HeaderQuery,
} from 'storefrontapi.generated';
import { CartToggle } from '../cart-toggle';
import { DesktopMenu } from '../desktop-menu';
import { DesktopSearch } from '../desktop-search';
import { MobileSearch } from '../mobile-search';

export interface NavbarProps {
  cart: Promise<CartApiQueryFragment | null>;
  header: HeaderQuery;
  isLoggedIn: boolean;
}

export function Navbar({ header, isLoggedIn, cart }: NavbarProps) {
  const { shop, menu } = header;
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      component="header"
      sx={{
        backdropFilter: 'saturate(180%) blur(20px)',
        background: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <Toolbar
        sx={{ display: { xs: mobileSearchOpen ? 'none' : 'flex', md: 'flex' } }}
      >
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { md: 'none' }, mr: 1 }}
          onClick={() => window.dispatchEvent(new Event('menu-open'))}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          fontSize={20}
          color="inherit"
          component={NavLink}
          prefetch="intent"
          to="/"
          end
          mr={2}
        >
          {shop.name}
        </Typography>

        <DesktopMenu menu={menu} shop={header.shop} />

        <Box flex="1 1 auto" />

        <DesktopSearch />

        <IconButton
          color="inherit"
          sx={{ display: { md: 'none' } }}
          onClick={() => setMobileSearchOpen(true)}
        >
          <SearchIcon />
        </IconButton>

        <CartToggle cart={cart} />

        <IconButton
          color="inherit"
          edge="end"
          component={NavLink}
          prefetch="intent"
          to="/account"
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
      <MobileSearch
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </AppBar>
  );
}
