import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import type {LayoutProps} from '../../layouts/app';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Navbar({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <AppBar
      position="sticky"
      component="header"
      sx={{
        backdropFilter: 'saturate(180%) blur(20px)',
        background: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <Toolbar>
        <IconButton
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
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </Toolbar>
    </AppBar>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    window.dispatchEvent(new Event('menu-close'));
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <Typography
            key={item.id}
            component={NavLink}
            prefetch="intent"
            to={url}
            end
            onClick={closeAside}
            sx={{
              color: 'inherit',
              transition: 'color .32s cubic-bezier(.4,0,.6,1)',
              '&:hover': {
                color: '#ffffff',
              },
            }}
          >
            {item.title}
          </Typography>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
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
      <HeaderMenuMobileToggle />
    </Box>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <Box
      component="a"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new Event('menu-open'));
      }}
      sx={(theme) => ({
        display: 'flex',
        color: 'inherit',
        transition: 'color .32s cubic-bezier(.4,0,.6,1)',
        '&:hover': {
          color: '#ffffff',
        },
        [theme.breakpoints.up('sm')]: {
          display: 'none',
        },
      })}
    >
      <MenuIcon />
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

function CartBadge({count}: {count: number}) {
  return (
    <Box
      component="a"
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'inherit',
        transition: 'color .32s cubic-bezier(.4,0,.6,1)',
        '&:hover': {
          color: '#ffffff',
        },
      }}
      href="#"
      onClick={() => {
        window.dispatchEvent(new Event('cart-open'));
      }}
    >
      {count > 0 ? <ShoppingBagIcon /> : <ShoppingBagOutlinedIcon />}
      {count > 0 && <Box sx={{ml: 0.5}}>{count}</Box>}
    </Box>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
