import { createContext, useState, useEffect, type ReactNode } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import UserStore from "@/store/UserStore";
import ProductStore from "@/store/ProductStore";
// Определяем интерфейс для нашего контекста
export interface IStoreContext {
  user: UserStore;
  product: ProductStore;
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
  } | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      const [
        { default: UserStore },
        { default: ProductStore },
      ] = await Promise.all([
        import("@/store/UserStore"),
        import("@/store/ProductStore"),
      ]);

      setStores({
        user: new UserStore(),
        product: new ProductStore(),
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

