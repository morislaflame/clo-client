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
import { useTranslate } from "@/utils/useTranslate";

const Navigation = observer(() => {
  const { user, basket } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t } = useTranslate();

  // Загружаем количество товаров в корзине при авторизации
  useEffect(() => {
    if (user.isAuth) {
      basket.loadBasketCount().catch(console.error);
    }
    // При выходе корзина автоматически переключается на локальную
  }, [user.isAuth, basket]);

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isMenuOpen && event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await user.logout();
    navigate(MAIN_ROUTE);
  };

  const handleBasketClick = () => {
    // Теперь корзина доступна и гостям
    navigate(BASKET_ROUTE);
  };

  const handleLanguageChange = (language: 'ru' | 'en' | 'kz') => {
    user.setLanguage(language);
  };

  const publicMenuItems = [
    { name: t("news"), href: NEWS_ROUTE },
    { name: t("shop"), href: MAIN_ROUTE },
    { name: t("drops"), href: COLLECTIONS_ROUTE },
    { name: t("about"), href: "#" },
  ];

  const authMenuItems = user.isAuth 
    ? [
        { name: t("profile"), href: "#", action: () => {} },
        { name: t("my_orders"), href: ORDERS_ROUTE, action: () => navigate(ORDERS_ROUTE) },
        { name: t("logout"), href: "#", action: handleLogout, color: "danger" },
      ]
    : [
        { name: t("enter"), href: LOGIN_ROUTE, action: () => navigate(LOGIN_ROUTE) },
        { name: t("registration"), href: REGISTRATION_ROUTE, action: () => navigate(REGISTRATION_ROUTE) },
      ];

  return (
    <>
      {/* Оверлей для закрытия меню при клике вне его */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <Navbar 
        onMenuOpenChange={setIsMenuOpen} 
        maxWidth="full" 
        isBordered 
        position="sticky"
        isMenuOpen={isMenuOpen}
        className="dark relative z-50"
      >
      <NavbarContent className="z-50">
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
          <img src="/lg.png" alt="Logo" className="sm:h-[32px] h-[28px]" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {/* Переключатель языка */}
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="light"
                size="sm"
                className="text-default-600"
              >
                {user.language.toUpperCase()}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Language selection">
              <DropdownItem 
                key="ru" 
                onClick={() => handleLanguageChange('ru')}
                className={user.language === 'ru' ? 'bg-default-100' : ''}
              >
                {t("russian")}
              </DropdownItem>
              <DropdownItem 
                key="en" 
                onClick={() => handleLanguageChange('en')}
                className={user.language === 'en' ? 'bg-default-100' : ''}
              >
                {t("english")}
              </DropdownItem>
              <DropdownItem 
                key="kz" 
                onClick={() => handleLanguageChange('kz')}
                className={user.language === 'kz' ? 'bg-default-100' : ''}
              >
                {t("kazakh")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        {/* Кнопка корзины */}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            className="relative"
            onClick={handleBasketClick}
            aria-label={t("basket")}
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
                {t("profile")}
              </DropdownItem>
              <DropdownItem key="orders" onClick={() => navigate(ORDERS_ROUTE)}>
                {t("my_orders")}
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                className="text-danger" 
                color="danger"
                onClick={handleLogout}
              >
                {t("logout")}
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
                {t("enter")}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                color="default" 
                variant="flat"
                onClick={() => navigate(REGISTRATION_ROUTE)}
              >
                {t("registration")}
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu 
        className="overflow-y-auto dark p-6"
        motionProps={{
          initial: { x: "-100%", opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: "-100%", opacity: 0 },
          transition: { type: "spring", stiffness: 300, damping: 30 }
        }}
        style={{
          width: "240px",
          zIndex: 1000,
        }}
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
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
    </>
  );
});

export default Navigation;

