# ✅ Frontend изменения - Сводка

## 🎯 Что было сделано

### 1. Обновленные/Созданные файлы

#### 📄 `src/store/BasketStore.ts` (переработан)
- ✅ Объединенная логика локальной и серверной корзины в одном файле
- ✅ Автоматическое переключение между локальным хранилищем (гости) и сервером (авторизованные)
- ✅ Метод `migrateLocalToServer()` - миграция корзины при входе
- ✅ Метод `getCheckoutData()` - получение данных для заказа
- ✅ Локальное хранилище с автоматической очисткой через 30 дней

**Ключевые особенности:**
```typescript
// Автоматическое определение типа пользователя
private get isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('isGuest') === 'true';
  return !!token && !isGuest;
}

// Универсальные методы работают для гостей и авторизованных
async addProductToBasket(product: Product, selectedColorId?, selectedSizeId?)
async removeProductFromBasket(productId, selectedColorId?, selectedSizeId?)
async updateItemQuantity(productId, quantity, selectedColorId?, selectedSizeId?)
```

#### 📄 `src/store/UserStore.ts` (обновлен)
- ✅ Параметр `basketStore` в методах `login()` и `register()`
- ✅ Автоматическая миграция корзины после успешного входа/регистрации
- ✅ Удаление флага `isGuest` при авторизации

**Изменения:**
```typescript
async login(email: string, password: string, basketStore?: BasketStore) {
  // ... авторизация ...
  
  // Мигрируем локальную корзину на сервер
  if (basketStore) {
    await basketStore.migrateLocalToServer();
  }
}
```

#### 📄 `src/http/orderAPI.ts` (обновлен)
- ✅ Добавлен интерфейс `CreateGuestOrderRequest`
- ✅ Добавлен метод `createGuestOrder()` для создания гостевых заказов

**Новые типы:**
```typescript
export interface CreateGuestOrderRequest {
  recipientName: string;
  recipientAddress: string;
  recipientPhone?: string;
  recipientEmail?: string;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  notes?: string;
  items: Array<{
    productId: number;
    selectedColorId?: number;
    selectedSizeId?: number;
    quantity: number;
  }>;
}
```

#### 📄 `src/store/OrderStore.ts` (обновлен)
- ✅ Метод `createOrder()` теперь поддерживает гостевые заказы
- ✅ Автоматическое определение типа пользователя
- ✅ Очистка локальной корзины после создания гостевого заказа

**Логика:**
```typescript
async createOrder(orderData, basketStore?) {
  const isGuest = localStorage.getItem('isGuest') === 'true';
  
  if (isGuest && basketStore) {
    // Для гостей - отправляем товары в запросе
    const basketData = basketStore.getCheckoutData();
    response = await createGuestOrder({ ...orderData, items: basketData.items });
    basketStore.clearBasket();
  } else {
    // Для авторизованных - заказ из серверной корзины
    response = await createOrder(orderData);
  }
}
```

#### 📄 `src/http/userAPI.ts` (обновлен ранее)
- ✅ Функция `createGuestUser()` для создания гостевой сессии

#### 📄 `src/pages/ProductPage.tsx` (обновлен)
- ✅ Убрана проверка авторизации перед добавлением в корзину
- ✅ Обновлен вызов `basket.addProductToBasket()` - теперь передается `product` вместо `productId`
- ✅ Гости могут добавлять товары в локальную корзину

**До:**
```typescript
if (!user.isAuth) {
  navigate('/login');
  return;
}

await basket.addProductToBasket(Number(id), colorId, sizeId);
```

**После:**
```typescript
// Проверка авторизации убрана
await basket.addProductToBasket(currentProduct, colorId, sizeId);
```

### 2. Удаленные файлы

- ❌ `src/store/LocalBasketStore.ts` - логика объединена в BasketStore
- ❌ `src/store/UnifiedBasketStore.ts` - заменен на BasketStore

## 🔌 Использование в компонентах

### Пример: Страница входа

```typescript
import { Context } from '@/store/StoreProvider';

const LoginPage = observer(() => {
  const { user, basket } = useContext(Context) as IStoreContext;
  
  const handleLogin = async () => {
    const result = await user.login(email, password, basket);
    
    if (result.success) {
      // Корзина автоматически мигрировала!
      navigate('/');
    }
  };
});
```

### Пример: Страница оформления заказа

```typescript
import { Context } from '@/store/StoreProvider';

const CheckoutPage = observer(() => {
  const { order, basket } = useContext(Context) as IStoreContext;
  const isGuest = localStorage.getItem('isGuest') === 'true';
  
  const handleSubmit = async (formData) => {
    // Для гостей нужны дополнительные поля
    if (isGuest) {
      formData.recipientPhone = phone;
      formData.recipientEmail = email;
    }
    
    // Метод автоматически определяет тип пользователя
    const result = await order.createOrder(formData, basket);
    
    if (result.success) {
      // Корзина автоматически очищена
      navigate('/order-success');
    }
  };
});
```

### Пример: Добавление в корзину

```typescript
const ProductPage = observer(() => {
  const { product, basket } = useContext(Context) as IStoreContext;
  
  const handleAddToBasket = async () => {
    // Работает и для гостей, и для авторизованных
    const result = await basket.addProductToBasket(
      currentProduct,
      selectedColorId,
      selectedSizeId
    );
    
    if (result.success) {
      // Товар добавлен!
    }
  };
});
```

## 📊 Схема работы

### Сценарий 1: Гостевая покупка

```
1. Пользователь → Открывает сайт (без входа)
2. [Опционально] → POST /api/user/guest → Получает гостевой токен
3. Добавляет товары → Сохраняются в localStorage
4. Переходит к оформлению → Заполняет форму с телефоном/email
5. Создает заказ → POST /api/order/guest (товары в запросе)
6. localStorage очищается
```

### Сценарий 2: Миграция корзины

```
1. Гость → Добавил 3 товара в localStorage
2. Решил войти → POST /api/user/login
3. BasketStore.migrateLocalToServer() → Автоматически
4. 3 товара из localStorage → POST /api/basket/add (×3)
5. localStorage очищается
6. Корзина загружается с сервера
```

### Сценарий 3: Авторизованная покупка

```
1. Авторизованный пользователь → Добавляет товары
2. Товары → Сразу на сервер (POST /api/basket/add)
3. Оформляет заказ → POST /api/order/create
4. Серверная корзина очищается
```

## 🔍 Важные моменты

### 1. Определение типа пользователя

Гостевые пользователи определяются по флагу в `localStorage`:
```typescript
const isGuest = localStorage.getItem('isGuest') === 'true';
const token = localStorage.getItem('token');
```

### 2. Структура localStorage

```typescript
// Гостевая корзина
localStorage.setItem('local_basket', JSON.stringify({
  items: [...],
  timestamp: Date.now()
}));

// Флаг гостя
localStorage.setItem('isGuest', 'true');

// Токен (есть и у гостей, и у авторизованных)
localStorage.setItem('token', 'jwt_token');
```

### 3. Срок хранения

- Локальная корзина хранится **30 дней**
- Токен JWT действует **24 часа** (настраивается на backend)

## ✅ Проверочный список

- [ ] BasketStore работает для гостей (localStorage)
- [ ] BasketStore работает для авторизованных (server)
- [ ] Миграция корзины при входе работает
- [ ] Миграция корзины при регистрации работает
- [ ] Товары добавляются в корзину без авторизации
- [ ] Гостевой заказ создается корректно
- [ ] Локальная корзина очищается после заказа
- [ ] Счетчик товаров в навбаре обновляется
- [ ] Переключение между валютами работает

## 🧪 Тестирование

### Тест 1: Гостевая покупка
```typescript
1. Откройте сайт в режиме инкогнито
2. Добавьте товар в корзину
3. Проверьте localStorage['local_basket']
4. Перейдите к оформлению
5. Заполните форму (с телефоном и email)
6. Создайте заказ
7. Проверьте, что корзина очистилась
```

### Тест 2: Миграция корзины
```typescript
1. Добавьте 2-3 товара как гость
2. Войдите в систему
3. Откройте DevTools → Network
4. Должны быть запросы POST /api/basket/add
5. Проверьте корзину - товары должны быть там
6. localStorage['local_basket'] должен быть удален
```

### Тест 3: Авторизованная покупка
```typescript
1. Войдите в систему
2. Добавьте товары в корзину
3. Проверьте, что запросы идут на сервер
4. Оформите заказ
5. Проверьте, что корзина очистилась на сервере
```

## 🐛 Возможные проблемы

### Ошибка: "Product not found"
```typescript
// Причина: передается productId вместо product
// Решение:
basket.addProductToBasket(product, colorId, sizeId);
// НЕ:
basket.addProductToBasket(productId, colorId, sizeId);
```

### Ошибка: Корзина не мигрирует
```typescript
// Убедитесь, что basketStore передается:
user.login(email, password, basket); // ✅
user.login(email, password); // ❌ корзина не мигрирует
```

### Ошибка: "Items are required"
```typescript
// Для гостевых заказов нужны товары
order.createOrder(orderData, basket); // ✅
order.createOrder(orderData); // ❌ для гостей не сработает
```

## 📚 Дополнительные компоненты для обновления

### CheckoutForm (рекомендуется)
Добавьте поля для гостей:

```typescript
const CheckoutForm = () => {
  const isGuest = localStorage.getItem('isGuest') === 'true';
  
  return (
    <form>
      <Input name="recipientName" required />
      <Input name="recipientAddress" required />
      
      {isGuest && (
        <>
          <Input 
            type="tel" 
            name="recipientPhone" 
            placeholder="Телефон" 
            required 
          />
          <Input 
            type="email" 
            name="recipientEmail" 
            placeholder="Email" 
            required 
          />
        </>
      )}
      
      {/* ... остальные поля ... */}
    </form>
  );
};
```

### App.tsx (опционально)
Автоматическое создание гостевой сессии:

```typescript
useEffect(() => {
  const initGuestSession = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Создаем гостевого пользователя
      try {
        const { createGuestUser } = await import('@/http/userAPI');
        await createGuestUser();
      } catch (error) {
        console.error('Error creating guest session:', error);
      }
    }
  };

  initGuestSession();
}, []);
```

## 🚀 Что дальше?

1. ✅ Протестируйте все сценарии
2. ✅ Обновите компоненты форм (CheckoutForm, LoginForm и т.д.)
3. ✅ Добавьте уведомления пользователю
4. ✅ Настройте аналитику для отслеживания гостевых покупок
5. ✅ Добавьте возможность отслеживания заказа по номеру (для гостей)

## 📞 Нужна помощь?

Если возникли проблемы:
1. Проверьте console.log в браузере
2. Проверьте Network во вкладке DevTools
3. Убедитесь, что backend запущен и доступен
4. Проверьте, что все store'ы правильно передаются

---

**Frontend готов к работе с гостевыми пользователями! 🎉**


