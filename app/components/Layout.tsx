import {Await} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu, MobileSideMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {CircularProgress, CssBaseline, CssVarsProvider, Drawer} from '@mui/joy';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} shop={header.shop} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} shop={header.shop} />}
        </Await>
      </Suspense>
    </CssVarsProvider>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    window.addEventListener('cart-open', handleOpen);
    window.addEventListener('cart-close', handleClose);
    return () => {
      window.removeEventListener('cart-open', handleOpen);
      window.removeEventListener('cart-close', handleClose);
    };
  }, []);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      invertedColors
    >
      <Suspense fallback={<CircularProgress />}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Drawer>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  menu,
  shop,
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}) {
  const [open, setOpen] = useState(false);
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
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      invertedColors
    >
      <MobileSideMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
    </Drawer>
  );
}
