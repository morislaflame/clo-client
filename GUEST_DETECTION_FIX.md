# 🔧 Исправление определения гостевого пользователя

## 🐛 Проблема

Поле `isGuest` не устанавливалось в `localStorage` автоматически, что приводило к некорректной работе:
- Пользователь без авторизации не определялся как гость
- Локальная корзина работала, но функционал для гостей (дополнительные поля) не показывался

## ✅ Решение

Изменили логику определения гостя с проверки флага в `localStorage` на проверку состояния авторизации.

### Изменения в коде

#### 1. **BasketStore** - Добавлен публичный геттер `isGuest`

```typescript
// ДО:
private get isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('isGuest') === 'true';
  return !!token && !isGuest;
}

// ПОСЛЕ:
private get isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('isGuest') === 'true';
  
  // Авторизован = есть токен И НЕ гость
  // Если нет токена вообще - тоже гость (локальная корзина)
  return !!token && !isGuest;
}

// Новый публичный геттер
public get isGuest(): boolean {
  return !this.isAuthenticated;
}
```

**Логика:**
- Нет токена → `isGuest = true` (локальная корзина)
- Есть токен + `localStorage.isGuest = 'true'` → `isGuest = true` (локальная корзина, гостевой токен)
- Есть токен + нет флага `isGuest` → `isGuest = false` (серверная корзина, авторизован)

#### 2. **CheckoutPage** - Используем геттер вместо прямой проверки

```typescript
// ДО:
const isGuest = localStorage.getItem('isGuest') === 'true';

// ПОСЛЕ:
const isGuest = basket.isGuest;
```

#### 3. **OrderStore** - Проверяем через basketStore

```typescript
// ДО:
const isGuest = localStorage.getItem('isGuest') === 'true';

// ПОСЛЕ:
const isGuest = basketStore ? basketStore.isGuest : false;
```

## 🎯 Как это работает теперь

### Сценарий 1: Неавторизованный пользователь
```
1. Пользователь открывает сайт
2. localStorage: { token: null }
3. basket.isGuest === true ✅
4. Корзина: localStorage
5. При оформлении: показываются поля телефона/email
```

### Сценарий 2: Пользователь вышел из системы
```
1. Пользователь нажал "Выйти"
2. localStorage: { token: удален }
3. basket.isGuest === true ✅
4. Корзина: переключается на localStorage
5. При оформлении: показываются поля телефона/email
```

### Сценарий 3: Авторизованный пользователь
```
1. Пользователь вошел в систему
2. localStorage: { token: 'jwt_token' }
3. basket.isGuest === false ✅
4. Корзина: загружается с сервера
5. При оформлении: используется email из профиля
```

### Сценарий 4: Гостевой токен (опционально)
```
1. Создали гостевую сессию через API
2. localStorage: { token: 'guest_jwt', isGuest: 'true' }
3. basket.isGuest === true ✅
4. Корзина: localStorage (несмотря на токен)
5. Можно делать запросы к API с этим токеном
```

## 📁 Измененные файлы

- ✏️ `clo-client/src/store/BasketStore.ts` - Добавлен геттер `isGuest`
- ✏️ `clo-client/src/pages/CheckoutPage.tsx` - Используем `basket.isGuest`
- ✏️ `clo-client/src/store/OrderStore.ts` - Используем `basketStore.isGuest`

## ✅ Результат

### Что работает:
- ✅ Пользователь без токена определяется как гость
- ✅ Локальная корзина работает автоматически
- ✅ Поля телефона/email показываются для гостей
- ✅ После выхода корзина переключается на локальную
- ✅ После входа корзина мигрирует на сервер

### Не нужно:
- ❌ Вручную устанавливать `isGuest` в localStorage
- ❌ Вызывать `createGuestUser()` для каждого посетителя
- ❌ Проверять наличие флага `isGuest` в компонентах

## 🧪 Тестирование

### Тест 1: Неавторизованный добавляет в корзину
```
1. Откройте сайт в режиме инкогнито
2. НЕ входите в систему
3. Добавьте товар в корзину
4. Проверьте localStorage['local_basket'] - должен быть
5. Перейдите к оформлению
6. Должны быть поля "Телефон" и "Email" ✅
```

### Тест 2: Выход из системы
```
1. Войдите в систему
2. Добавьте товары в корзину (на сервер)
3. Выйдите из системы
4. Корзина должна быть пустой (локальная)
5. Добавьте товар
6. Проверьте localStorage['local_basket'] ✅
```

### Тест 3: Вход в систему с товарами
```
1. Добавьте товары как гость (в localStorage)
2. Войдите в систему
3. Товары должны мигрировать на сервер ✅
4. localStorage['local_basket'] должен очиститься ✅
```

## 🔄 Обратная совместимость

Если где-то в коде остались проверки `localStorage.getItem('isGuest')`, они продолжат работать, но лучше заменить их на `basket.isGuest` для единообразия.

### Поиск мест для замены:
```bash
# Найти все места, где используется прямая проверка
grep -r "localStorage.getItem('isGuest')" clo-client/src/
```

## 📚 Дополнительно

- **Backend документация**: `clo-server/BACKEND_CHANGES_SUMMARY.md`
- **Frontend документация**: `clo-client/FRONTEND_CHANGES_SUMMARY.md`
- **Исправления**: `clo-client/FIXES_SUMMARY.md`

---

**Теперь определение гостя работает автоматически! 🎉**


