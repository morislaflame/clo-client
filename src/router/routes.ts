// src/routes.ts (если у вас массив роутов)
import type { ComponentType } from 'react';
import MainPage from '@/pages/MainPage';
import AuthPage from '@/pages/AuthPage';
import ProductPage from '@/pages/ProductPage';
import BasketPage from '@/pages/BasketPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import NewsPage from '@/pages/NewsPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import CollectionsPage from '@/pages/CollectionsPage';
import CollectionPage from '@/pages/CollectionPage';
import { MAIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, BASKET_ROUTE, CHECKOUT_ROUTE, ORDERS_ROUTE, NEWS_ROUTE, NEWS_DETAIL_ROUTE, COLLECTIONS_ROUTE } from '@/utils/consts';

interface Route {
  path: string;
  Component: ComponentType;
}

export const publicRoutes: Route[] = [
  { path: MAIN_ROUTE, Component: MainPage },
  { path: LOGIN_ROUTE, Component: AuthPage },
  { path: REGISTRATION_ROUTE, Component: AuthPage },
  { path: '/product/:id', Component: ProductPage },
  { path: NEWS_ROUTE, Component: NewsPage },
  { path: NEWS_DETAIL_ROUTE, Component: NewsDetailPage },
  { path: COLLECTIONS_ROUTE, Component: CollectionsPage },
  { path: '/collection/:id', Component: CollectionPage },
];

export const privateRoutes: Route[] = [
  { path: BASKET_ROUTE, Component: BasketPage },
  { path: CHECKOUT_ROUTE, Component: CheckoutPage },
  { path: ORDERS_ROUTE, Component: OrdersPage },
];
