import React, { useContext, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
import { LOGIN_ROUTE, REGISTRATION_ROUTE, MAIN_ROUTE, BASKET_ROUTE, NEWS_ROUTE, ORDERS_ROUTE, COLLECTIONS_ROUTE } from "@/utils/consts";
import { ShoppingCartIcon } from "@/components/ui/Icons";

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

  // Закрытие меню при клике вне его и нажатии Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as Element;
        // Ищем навбар по классу или data-атрибуту
        const navbar = document.querySelector('[data-menu-open="true"]') || 
                      document.querySelector('.navbar') ||
                      document.querySelector('[role="navigation"]');
        
        if (navbar && !navbar.contains(target)) {
          setIsMenuOpen(false);
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (isMenuOpen && event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Небольшая задержка, чтобы не закрыть меню сразу после открытия
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      document.addEventListener('keydown', handleEscape);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isMenuOpen]);

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
    { name: "Новости", href: NEWS_ROUTE },
    { name: "Магазин", href: MAIN_ROUTE },
    { name: "Дропы", href: COLLECTIONS_ROUTE },
    { name: "О нас", href: "#" },
  ];

  const authMenuItems = user.isAuth 
    ? [
        { name: "Профиль", href: "#", action: () => {} },
        { name: "Мои заказы", href: ORDERS_ROUTE, action: () => navigate(ORDERS_ROUTE) },
        { name: "Выйти", href: "#", action: handleLogout, color: "danger" },
      ]
    : [
        { name: "Войти", href: LOGIN_ROUTE, action: () => navigate(LOGIN_ROUTE) },
        { name: "Регистрация", href: REGISTRATION_ROUTE, action: () => navigate(REGISTRATION_ROUTE) },
      ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen} 
      maxWidth="full" 
      isBordered 
      position="sticky"
      isMenuOpen={isMenuOpen}
      className="dark"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        {/* Ссылки слева */}
        <NavbarContent className="hidden sm:flex gap-6" justify="start">
          {publicMenuItems.map((item) => (
            <NavbarItem key={item.name}>
              <Link 
                as={RouterLink}
                color="foreground" 
                to={item.href}
                className="hover:text-default-500 transition-colors"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </NavbarContent>

      {/* Бренд по центру */}
      <NavbarContent justify="center">
        <NavbarBrand className="cursor-pointer" onClick={() => navigate(MAIN_ROUTE)}>
          <img src="/lg.png" alt="Logo" className="h-[35px]" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
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
              <DropdownItem key="orders" onClick={() => navigate(ORDERS_ROUTE)}>
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
                as={RouterLink}
                className="text-default-600 hover:text-default-500 transition-colors cursor-pointer" 
                to={LOGIN_ROUTE}
              >
                Вход
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                color="default" 
                variant="flat"
                onClick={() => navigate(REGISTRATION_ROUTE)}
              >
                Регистрация
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu className="max-h-[60vh] overflow-y-auto dark"
      style={{ backdropFilter: "blur(40px)" }}
      >
        {/* Публичные пункты меню */}
        {publicMenuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              as={RouterLink}
              className="w-full"
              to={item.href}
              size="lg"
              color="foreground"
              onClick={() => {
                setIsMenuOpen(false);
                navigate(item.href);
              }}
              // style={{ color: "white" }}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        
        {/* Разделитель */}
        <NavbarMenuItem>
          <div className="w-full h-px bg-default-500 my-2" />
        </NavbarMenuItem>

        {/* Пункты авторизации */}
        {authMenuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="w-full"
              color={(item.color as "danger") || "foreground"}
              onClick={() => {
                item.action();
                setIsMenuOpen(false);
              }}
              size="lg"
              // style={{ color: "white" }}
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

