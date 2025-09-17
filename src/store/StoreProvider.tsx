import { createContext, useState, useEffect, type ReactNode } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import UserStore from "@/store/UserStore";
import ProductStore from "@/store/ProductStore";
import BasketStore from "@/store/BasketStore";
import OrderStore from "@/store/OrderStore";
import NewsStore from "@/store/NewsStore";
import NewsTypeStore from "@/store/NewsTypeStore";
// Определяем интерфейс для нашего контекста
export interface IStoreContext {
  user: UserStore;
  product: ProductStore;
  basket: BasketStore;
  order: OrderStore;
  news: NewsStore;
  newsType: NewsTypeStore;
}

let storeInstance: IStoreContext | null = null;

// Функция для получения экземпляра хранилища
export function getStore(): IStoreContext {
  if (!storeInstance) {
    throw new Error("Store not initialized");
  }
  return storeInstance;
}

// Создаем контекст с начальным значением null, но указываем правильный тип
export const Context = createContext<IStoreContext | null>(null);

// Добавляем типы для пропсов
interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider = ({ children }: StoreProviderProps) => {
  const [stores, setStores] = useState<{
    user: UserStore;
    product: ProductStore;
    basket: BasketStore;
    order: OrderStore;
    news: NewsStore;
    newsType: NewsTypeStore;
  } | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      const [
        { default: UserStore },
        { default: ProductStore },
        { default: BasketStore },
        { default: OrderStore },
        { default: NewsStore },
        { default: NewsTypeStore },
      ] = await Promise.all([
        import("@/store/UserStore"),
        import("@/store/ProductStore"),
        import("@/store/BasketStore"),
        import("@/store/OrderStore"),
        import("@/store/NewsStore"),
        import("@/store/NewsTypeStore"),
      ]);

      setStores({
        user: new UserStore(),
        product: new ProductStore(),
        basket: new BasketStore(),
        order: new OrderStore(),
        news: new NewsStore(),
        newsType: new NewsTypeStore(),
      });
    };

    loadStores();
  }, []);

  if (!stores) {
    return <LoadingIndicator />; 
  }

  // Сохраняем экземпляр хранилища для доступа из других модулей
  storeInstance = stores;

  return <Context.Provider value={stores}>{children}</Context.Provider>;
};

export default StoreProvider;

