// src/routes.ts (если у вас массив роутов)
import MainPage from '@/pages/MainPage';
import { MAIN_ROUTE } from '@/utils/consts';


export const publicRoutes = [
  { path: MAIN_ROUTE, Component: MainPage },
];

export const privateRoutes = [
  // ...
];
