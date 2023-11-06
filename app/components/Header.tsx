import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import {Avatar, Badge, Box, SvgIcon, Typography} from '@mui/joy';
import {Bag, BagFill, List, PeaceFill, Search} from 'react-bootstrap-icons';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <Box
      component="header"
      sx={{
        height: 44,
        backdropFilter: 'saturate(180%) blur(20px)',
        background: 'rgba(22, 22, 23, 0.8)',
        position: 'fixed',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        accentColor: 'auto',
        color: 'rgba(255, 255, 255, 0.7)',
        px: 2,
        alignItems: 'center',
        display: 'flex',
        userSelect: 'none',
      }}
    >
      <Typography
        component={NavLink}
        prefetch="intent"
        to="/"
        end
        sx={{
          color: 'inherit',
          transition: 'color .32s cubic-bezier(.4,0,.6,1)',
          '&:hover': {
            color: '#ffffff',
          },
        }}
      >
        <PeaceFill />
        {shop.name}
      </Typography>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </Box>
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
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
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
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
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
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <Box
      component="a"
      href="#mobile-menu-aside"
      className="header-menu-mobile-toggle"
      sx={{
        color: 'inherit',
        transition: 'color .32s cubic-bezier(.4,0,.6,1)',
        '&:hover': {
          color: '#ffffff',
        },
      }}
    >
      <List />
    </Box>
  );
}

function SearchToggle() {
  return (
    <Box
      component="a"
      href="#search-aside"
      sx={{
        color: 'inherit',
        transition: 'color .32s cubic-bezier(.4,0,.6,1)',
        '&:hover': {
          color: '#ffffff',
        },
      }}
    >
      <Search />
    </Box>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <Badge badgeContent={count}>
      <Box
        component="a"
        sx={{
          color: 'inherit',
          transition: 'color .32s cubic-bezier(.4,0,.6,1)',
          '&:hover': {
            color: '#ffffff',
          },
        }}
        href="#cart-aside"
      >
        {count > 0 ? <BagFill /> : <Bag />}
      </Box>
    </Badge>
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
