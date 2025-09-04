// src/routes.ts (если у вас массив роутов)
import type { ComponentType } from 'react';
import MainPage from '@/pages/MainPage';
import AuthPage from '@/pages/AuthPage';
import { MAIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from '@/utils/consts';

interface Route {
  path: string;
  Component: ComponentType;
}

export const publicRoutes: Route[] = [
  { path: MAIN_ROUTE, Component: MainPage },
  { path: LOGIN_ROUTE, Component: AuthPage },
  { path: REGISTRATION_ROUTE, Component: AuthPage },
];

export const privateRoutes: Route[] = [
  // Для авторизованных пользователей - позже добавим личный кабинет и т.д.
];
