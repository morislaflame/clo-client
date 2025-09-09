import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, MAIN_ROUTE, BASKET_ROUTE } from "@/utils/consts";
import { ShoppingCartIcon } from "@/components/ui/Icons";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Navigation = observer(() => {
  const { user, basket } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Загружаем количество товаров в корзине при авторизации
  useEffect(() => {
    if (user.isAuth) {
      basket.loadBasketCount().catch(console.error);
    } else {
      // Сбрасываем счетчик при выходе
      basket.setSummary(0, 0, 0);
    }
  }, [user.isAuth, basket]);

  const handleLogout = async () => {
    await user.logout();
    navigate(MAIN_ROUTE);
  };

  const handleBasketClick = () => {
    if (user.isAuth) {
      navigate(BASKET_ROUTE);
    } else {
      navigate(LOGIN_ROUTE);
    }
  };

  const publicMenuItems = [
    { name: "Коллекции", href: "#" },
    { name: "Магазин", href: "#" },
    { name: "О нас", href: "#" },
  ];

  const authMenuItems = user.isAuth 
    ? [
        { name: "Профиль", href: "#", action: () => {} },
        { name: "Мои заказы", href: "#", action: () => {} },
        { name: "Выйти", href: "#", action: handleLogout, color: "danger" },
      ]
    : [
        { name: "Войти", href: LOGIN_ROUTE, action: () => navigate(LOGIN_ROUTE) },
        { name: "Регистрация", href: REGISTRATION_ROUTE, action: () => navigate(REGISTRATION_ROUTE) },
      ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" isBordered position="sticky">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="cursor-pointer" onClick={() => navigate(MAIN_ROUTE)}>
          <img src="/LOGO.svg" alt="Logo" className="h-[40px]" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-10" justify="center">
        {publicMenuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link 
              color="foreground" 
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {/* Кнопка корзины */}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            className="relative"
            onClick={handleBasketClick}
            aria-label="Корзина"
          >
            <Badge 
              content={basket.totalCount} 
              color="danger" 
              size="sm"
              isInvisible={basket.totalCount === 0}
            >
              <ShoppingCartIcon className="w-6 h-6" />
            </Badge>
          </Button>
        </NavbarItem>

        {user.isAuth ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  size="sm"
                  name={user.user?.email?.charAt(0).toUpperCase() || "U"}
                  className="bg-white text-black"
                />
                <span className="hidden md:block text-sm font-medium">
                  {user.user?.email}
                </span>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem key="profile" onClick={() => {}}>
                Профиль
              </DropdownItem>
              <DropdownItem key="orders" onClick={() => {}}>
                Мои заказы
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                className="text-danger" 
                color="danger"
                onClick={handleLogout}
              >
                Выйти
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link 
                className="text-default-600 hover:text-primary transition-colors cursor-pointer" 
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                Вход
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                color="primary" 
                variant="flat"
                onClick={() => navigate(REGISTRATION_ROUTE)}
              >
                Регистрация
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {/* Публичные пункты меню */}
        {publicMenuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="w-full"
              color="foreground"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        
        {/* Разделитель */}
        <NavbarMenuItem>
          <div className="w-full h-px bg-default-200 my-2" />
        </NavbarMenuItem>

        {/* Пункты авторизации */}
        {authMenuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="w-full"
              color={(item.color as "danger") || "foreground"}
              onClick={item.action}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
});

export default Navigation;

