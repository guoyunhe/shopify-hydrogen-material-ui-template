import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useShop } from '@shopify/hydrogen-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CartToggle } from '../cart-toggle';
import { DesktopMenu } from '../desktop-menu';
import { DesktopSearch } from '../desktop-search';
import { MobileSearch } from '../mobile-search';

export function Navbar() {
  const menu: any[] = [];
  const shop = useShop();
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

        <Typography fontSize={20} component={NavLink} to="/" end>
          TODO Shop Name
        </Typography>

        <DesktopMenu menu={menu} />

        <Box flex="1 1 auto" />

        <DesktopSearch />

        <IconButton
          color="inherit"
          sx={{ display: { md: 'none' } }}
          onClick={() => setMobileSearchOpen(true)}
        >
          <SearchIcon />
        </IconButton>

        <CartToggle />

        <IconButton
          color="inherit"
          edge="end"
          component={NavLink}
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
