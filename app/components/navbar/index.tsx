import {Menu as MenuIcon, Search as SearchIcon} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import {NavLink} from '@remix-run/react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {CartToggle} from '../cart-toggle';
import {DesktopMenu} from '../desktop-menu';

export interface NavbarProps {
  cart: Promise<CartApiQueryFragment | null>;
  header: HeaderQuery;
  isLoggedIn: boolean;
}

export function Navbar({header, isLoggedIn, cart}: NavbarProps) {
  const {shop, menu} = header;
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
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{display: {md: 'none'}, mr: 1}}
          onClick={() => window.dispatchEvent(new Event('menu-open'))}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          fontSize={20}
          component={NavLink}
          prefetch="intent"
          to="/"
          end
        >
          {shop.name}
        </Typography>
        <DesktopMenu menu={menu} shop={header.shop} />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </Toolbar>
    </AppBar>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<NavbarProps, 'isLoggedIn' | 'cart'>) {
  return (
    <Box
      component="nav"
      className="header-ctas"
      role="navigation"
      sx={{display: 'flex', alignItems: 'center'}}
    >
      <Box
        component={NavLink}
        prefetch="intent"
        to="/account"
        sx={{
          color: 'inherit',
          transition: 'color .32s cubic-bezier(.4,0,.6,1)',
          '&:hover': {
            color: '#ffffff',
          },
        }}
      >
        {isLoggedIn ? <Avatar /> : <Avatar sx={{width: 20, height: 20}} />}
      </Box>
      <SearchToggle />
      <CartToggle cart={cart} />
    </Box>
  );
}

function SearchToggle() {
  return (
    <Box
      component="a"
      href="#search-aside"
      sx={{
        display: 'flex',
        color: 'inherit',
        transition: 'color .32s cubic-bezier(.4,0,.6,1)',
        '&:hover': {
          color: '#ffffff',
        },
      }}
    >
      <SearchIcon />
    </Box>
  );
}
