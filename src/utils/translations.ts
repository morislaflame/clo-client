type TranslationType = {
    [key: string]: {
      ru: string;
      en: string;
      kz: string;
    }
};
  
  export const translations: TranslationType = {
    balance: {
      ru: 'Баланс',
      en: 'Balance',
      kz: 'Баланс'
    },
    login: {
      ru: 'Вход в аккаунт',
      en: 'Login',
      kz: 'Кіру'
    },
    register: {
      ru: 'Создание аккаунта',
      en: 'Register',
      kz: 'Жазылу'
    },
    enter_data: {
      ru: 'Введите свои данные',
      en: 'Enter your data',
      kz: 'Өзіңіздің деректеріңізді енгізіңіз'
    },
    create_account: {
      ru: 'Создайте новый аккаунт для продолжения',
      en: 'Create an account to continue',
      kz: 'Жалғастыру үшін аккаунт жасау'
    },
    enter_email: {
      ru: 'Введите ваш email',
      en: 'Enter your email',
      kz: 'Өзіңіздің электрондық поштаңызды енгізіңіз'
    },
    enter_password: {
      ru: 'Введите пароль',
      en: 'Enter password',
      kz: 'Парольді енгізіңіз'
    },
    password: {
      ru: 'Пароль',
      en: 'Password',
      kz: 'Пароль'
    },
    confirm_password: {
      ru: 'Подтвердите пароль',
      en: 'Confirm password',
      kz: 'Парольді растаңыз'
    },
    no_account: {
      ru: 'Нет аккаунта?',
      en: 'No account?',
      kz: 'Аккаунт жоқ?'
    },
    already_have_account: {
      ru: 'Уже есть аккаунт?',
      en: 'Already have an account?',
      kz: 'Аккаунт бар?'
    },
    // Navigation
    news: {
      ru: 'Новости',
      en: 'News',
      kz: 'Жаңалықтар'
    },
    shop: {
      ru: 'Магазин',
      en: 'Shop',
      kz: 'Дүкен'
    },
    drops: {
      ru: 'Дропы',
      en: 'Drops',
      kz: 'Дроптар'
    },
    about: {
      ru: 'О нас',
      en: 'About',
      kz: 'Біз туралы'
    },
    profile: {
      ru: 'Профиль',
      en: 'Profile',
      kz: 'Профиль'
    },
    my_orders: {
      ru: 'Мои заказы',
      en: 'My Orders',
      kz: 'Менің тапсырыстарым'
    },
    logout: {
      ru: 'Выйти',
      en: 'Logout',
      kz: 'Шығу'
    },
    enter: {
      ru: 'Вход',
      en: 'Login',
      kz: 'Кіру'
    },
    registration: {
      ru: 'Регистрация',
      en: 'Registration',
      kz: 'Тіркелу'
    },
    // Product Filters
    filters: {
      ru: 'Фильтры',
      en: 'Filters',
      kz: 'Сүзгілер'
    },
    currency: {
      ru: 'Валюта',
      en: 'Currency',
      kz: 'Валюта'
    },
    tenge: {
      ru: 'Тенге (₸)',
      en: 'Tenge (₸)',
      kz: 'Теңге (₸)'
    },
    dollar: {
      ru: 'Доллар ($)',
      en: 'Dollar ($)',
      kz: 'Доллар ($)'
    },
    gender: {
      ru: 'Пол',
      en: 'Gender',
      kz: 'Жыныс'
    },
    select_gender: {
      ru: 'Выберите пол',
      en: 'Select gender',
      kz: 'Жынысты таңдаңыз'
    },
    male: {
      ru: 'Мужское',
      en: 'Male',
      kz: 'Еркек'
    },
    female: {
      ru: 'Женское',
      en: 'Female',
      kz: 'Әйел'
    },
    size: {
      ru: 'Размер',
      en: 'Size',
      kz: 'Өлшем'
    },
    select_size: {
      ru: 'Выберите размер',
      en: 'Select size',
      kz: 'Өлшемді таңдаңыз'
    },
    color: {
      ru: 'Цвет',
      en: 'Color',
      kz: 'Түс'
    },
    select_color: {
      ru: 'Выберите цвет',
      en: 'Select color',
      kz: 'Түсті таңдаңыз'
    },
    clothing_type: {
      ru: 'Тип одежды',
      en: 'Clothing Type',
      kz: 'Киім түрі'
    },
    select_type: {
      ru: 'Выберите тип',
      en: 'Select type',
      kz: 'Түрді таңдаңыз'
    },
    price: {
      ru: 'Цена',
      en: 'Price',
      kz: 'Баға'
    },
    from: {
      ru: 'От',
      en: 'From',
      kz: 'Басқа'
    },
    to: {
      ru: 'До',
      en: 'To',
      kz: 'Дейін'
    },
    reset_filters: {
      ru: 'Сбросить фильтры',
      en: 'Reset filters',
      kz: 'Сүзгілерді тазалау'
    },
    // News
    news_not_found: {
      ru: 'Новости не найдены',
      en: 'No news found',
      kz: 'Жаңалықтар табылмады'
    },
    news_not_found_description: {
      ru: 'По выбранным фильтрам новости не найдены',
      en: 'No news found for selected filters',
      kz: 'Таңдалған сүзгілер бойынша жаңалықтар табылмады'
    },
    // Basket
    basket: {
      ru: 'Корзина',
      en: 'Basket',
      kz: 'Себет'
    },
    back: {
      ru: 'Назад',
      en: 'Back',
      kz: 'Артқа'
    },
    basket_empty: {
      ru: 'Корзина пуста',
      en: 'Basket is empty',
      kz: 'Себет бос'
    },
    basket_empty_description: {
      ru: 'Добавьте товары в корзину, чтобы продолжить покупки',
      en: 'Add items to basket to continue shopping',
      kz: 'Сатып алуды жалғастыру үшін себетке тауарлар қосыңыз'
    },
    go_shopping: {
      ru: 'Перейти к покупкам',
      en: 'Go shopping',
      kz: 'Сатып алуға өту'
    },
    // Language switcher
    language: {
      ru: 'Язык',
      en: 'Language',
      kz: 'Тіл'
    },
    russian: {
      ru: 'Русский',
      en: 'Russian',
      kz: 'Орысша'
    },
    english: {
      ru: 'English',
      en: 'English',
      kz: 'English'
    },
    kazakh: {
      ru: 'Қазақша',
      en: 'Kazakh',
      kz: 'Қазақша'
    },
    // Basket components
    total: {
      ru: 'Итого',
      en: 'Total',
      kz: 'Барлығы'
    },
    items_count: {
      ru: 'Товаров:',
      en: 'Items:',
      kz: 'Тауарлар:'
    },
    sum: {
      ru: 'Сумма:',
      en: 'Sum:',
      kz: 'Сома:'
    },
    checkout: {
      ru: 'Оформить заказ',
      en: 'Checkout',
      kz: 'Тапсырыс беру'
    },
    clear_basket: {
      ru: 'Очистить корзину',
      en: 'Clear basket',
      kz: 'Себетті тазалау'
    },
    no_photo: {
      ru: 'Нет фото',
      en: 'No photo',
      kz: 'Фото жоқ'
    },
    remove_from_basket: {
      ru: 'Удалить из корзины',
      en: 'Remove from basket',
      kz: 'Себеттен алып тастау'
    },
    size_label: {
      ru: 'Размер',
      en: 'Size',
      kz: 'Өлшем'
    },
    add_more: {
      ru: 'Добавить еще',
      en: 'Add more',
      kz: 'Қосып шығу'
    },
    color_label: {
      ru: 'Цвет',
      en: 'Color',
      kz: 'Түс'
    },
    sizes: {
      ru: 'Размеры',
      en: 'Sizes',
      kz: 'Өлшемдер'
    },
    colors: {
      ru: 'Цвета',
      en: 'Colors',
      kz: 'Түстер'
    },
    clear_basket_confirmation: {
      ru: 'Вы уверены, что хотите удалить все товары из корзины?',
      en: 'Are you sure you want to clear the basket?',
      kz: 'Себетті тазалау керек пе?'
    },
    deleting: {
      ru: 'Удаление...',
      en: 'Deleting...',
      kz: 'Жоюда...'
    },
    delete_all: {
      ru: 'Удалить все',
      en: 'Delete all',
      kz: 'Барлығын жою'
    },
    // Collection components
    collection_not_found: {
      ru: 'Коллекция не найдена',
      en: 'Collection not found',
      kz: 'Жинақ табылмады'
    },
    no_image: {
      ru: 'Нет изображения',
      en: 'No image',
      kz: 'Сурет жоқ'
    },
    drop: {
      ru: 'Дроп',
      en: 'Drop',
      kz: 'Дроп'
    },
    products_in_collection_not_found: {
      ru: 'Товары в коллекции не найдены',
      en: 'Products in collection not found',
      kz: 'Жинақтағы тауарлар табылмады'
    },
    no_products_in_collection: {
      ru: 'В этой коллекции пока нет товаров',
      en: 'There are no products in this collection yet',
      kz: 'Бұл жинақта әлі тауарлар жоқ'
    },
    try_again: {
      ru: 'Попробовать снова',
      en: 'Try again',
      kz: 'Қайталау'
    },
    collections_not_found: {
      ru: 'Коллекции не найдены',
      en: 'Collections not found',
      kz: 'Жинақтар табылмады'
    },
    // MainPage
    loading: {
      ru: 'Загрузка...',
      en: 'Loading...',
      kz: 'Жүктелуде...'
    },
    products: {
      ru: 'Товаров',
      en: 'Products',
      kz: 'Тауарлар'
    },
    no_media_files: {
      ru: 'Нет медиафайлов',
      en: 'No media files',
      kz: 'Медиафайлдар жоқ'
    },
    // Orders
    no_orders: {
      ru: 'У вас пока нет заказов',
      en: 'You have no orders yet',
      kz: 'Әлі тапсырыстарыңыз жоқ'
    },
    no_orders_description: {
      ru: 'Когда вы сделаете свой первый заказ, он появится здесь.',
      en: 'When you make your first order, it will appear here.',
      kz: 'Үшінші тапсырысыңыз болғанда, ол мұнда көрінеді.'
    },
    no_orders_description2: {
      ru: 'Вы сможете отслеживать статус доставки и просматривать историю покупок.',
      en: 'You will be able to track the delivery status and view your purchase history.',
      kz: 'Тапсырысыңыздың статусын және сатып алған тауарларыңыздың тізімін қарауға болады.'
    },
    start_shopping: {
      ru: 'Начать покупки',
      en: 'Start shopping',
      kz: 'Сатып алуға өту'
    },
    created: {
      ru: 'Создан',
      en: 'Created',
      kz: 'Құрылған'
    },
    paid: {
      ru: 'Оплачен',
      en: 'Paid',
      kz: 'Төленген'
    },
    shipped: {
      ru: 'В пути',
      en: 'Shipped',
      kz: 'Жеткізілген'
    },
    delivered: {
      ru: 'Доставлен',
      en: 'Delivered',
      kz: 'Жеткізілген'
    },
    cancelled: {
      ru: 'Отменен',
      en: 'Cancelled',
      kz: 'Болдырмалды'
    },
    order: {
      ru: 'Заказ',
      en: 'Order',
      kz: 'Тапсырыс'
    },
    date: {
      ru: 'Дата',
      en: 'Date',
      kz: 'Дата'
    },
    recipient: {
      ru: 'Получатель',
      en: 'Recipient',
      kz: 'Алушы'
    },
    payment_method: {
      ru: 'Способ оплаты',
      en: 'Payment method',
      kz: 'Төлем әдісі'
    },
    notes: {
      ru: 'Заметки',
      en: 'Notes',
      kz: 'Ескертулер'
    },
    view_details: {
      ru: 'Подробнее',
      en: 'View details',
      kz: 'Толығырақ көру'
    },
    items_in_order: {
      ru: 'Товары в заказе',
      en: 'Items in order',
      kz: 'Тапсырыстағы тауарлар'
    },
    quantity: {
      ru: 'Количество',
      en: 'Quantity',
      kz: 'Саны'
    },
    order_info: {
      ru: 'Информация о заказе',
      en: 'Order info',
      kz: 'Тапсырыс туралы ақпарат'
    },
    date_created: {
      ru: 'Дата создания',
      en: 'Date created',
      kz: 'Құрылған дата'
    },
    date_updated: {
      ru: 'Дата обновления',
      en: 'Date updated',
      kz: 'Жаңартылған дата'
    },
    cash: {
      ru: 'Наличные',
      en: 'Cash',
      kz: 'Наличные'
    },
    card: {
      ru: 'Карта',
      en: 'Card',
      kz: 'Карта'
    },
    bank_transfer: {
      ru: 'Банковский перевод',
      en: 'Bank transfer',
      kz: 'Банковский перевод'
    },
    delivery_info: {
      ru: 'Информация о доставке',
      en: 'Delivery info',
      kz: 'Жеткізу туралы ақпарат'
    },
    address: {
      ru: 'Адрес',
      en: 'Address',
      kz: 'Адрес'
    },
    close: {
      ru: 'Закрыть',
      en: 'Close',
      kz: 'Жабу'
    },
    status: {
      ru: 'Статус',
      en: 'Status',
      kz: 'Статус'
    },
    status_filter: {
      ru: 'Фильтр статуса', 
      en: 'Status filter',
      kz: 'Статус сүзгісі'
    },
    checking: {
      ru: 'Проверка...',
      en: 'Checking...',
      kz: 'Жөнделуде...'
    },
    add_to_basket: {
      ru: 'Добавить в корзину',
      en: 'Add to basket',
      kz: 'Себетке қосу'
    },
    added_to_basket: {
      ru: 'Добавлено в корзину',
      en: 'Added to basket',
      kz: 'Себетке қосылған'
    },
    adding: {
      ru: 'Добавление...',
      en: 'Adding...',
      kz: 'Қосылуда...'
    },
    collection: {
      ru: 'Коллекция',
      en: 'Collection',
      kz: 'Жинақ'
    },
    ingredients: {
      ru: 'Состав',
      en: 'Ingredients',
      kz: 'Құрамы'
    },
    select_characteristics: {
      ru: 'Выберите характеристики',
      en: 'Select characteristics',
      kz: 'Характеристикаларды таңдаңыз'
    },
    please_select_color: {
      ru: 'Пожалуйста, выберите цвет',
      en: 'Please select color',
      kz: 'Түсті таңдаңыз'
    },
    please_select_size: {
      ru: 'Пожалуйста, выберите размер',
      en: 'Please select size',
      kz: 'Өлшемді таңдаңыз'
    },

    // Footer
    quick_links: {
      ru: 'Быстрые ссылки',
      en: 'Quick links',
      kz: 'Жылдам ссылки'
    },
    main: {
      ru: 'Главная',
      en: 'Main',
      kz: 'Басты'
    },
    contacts: {
      ru: 'Контакты',
      en: 'Contacts',
      kz: 'Байланыстар'
    },
    address_of_the_company: {
      ru: 'г. Алматы, ул. Абая 150',
      en: 'Almaty, Abay Avenue 150',
      kz: 'Алматы, Абай ауданы, 150-ші қатар'
    },
    privacy_policy: {
      ru: 'Политика конфиденциальности',
      en: 'Privacy policy',
      kz: 'Жекелік саясаты'
    },
    terms_of_use: {
      ru: 'Условия использования',
      en: 'Terms of use',
      kz: 'Қолдану шарттары'
    },
    return_and_exchange: {
      ru: 'Возврат и обмен',
      en: 'Return and exchange',
      kz: 'Қайтару және алмастыру'
    },
    // NewsDetailError
    to_news: {
      ru: 'К новостям',
      en: 'To news',
      kz: 'Жаңалыққа'
    },
    // CheckoutForm
    recipient_info: {
      ru: 'Информация о получателе',
      en: 'Recipient info',
      kz: 'Алушы туралы ақпарат'
    },
    recipient_name: {
      ru: 'ФИО получателя',
      en: 'Recipient name',
      kz: 'Алушының аты-жөні'
    },
    enter_recipient_name: {
      ru: 'Введите ФИО получателя',
      en: 'Enter recipient name',
      kz: 'Алушының аты-жөнін енгізіңіз'
    },
    
    delivery_address: {
      ru: 'Адрес доставки',
      en: 'Delivery address',
      kz: 'Жеткізу адресі'
    },
    start_typing_address: {
      ru: 'Начните вводить адрес для автодополнения',
      en: 'Start typing address for autocomplete',
      kz: 'Адресті автодополнениеге енгізу'
    },

    select_payment_method: {
      ru: 'Выберите способ оплаты',
      en: 'Select payment method',
      kz: 'Төлем әдісін таңдаңыз'
    },
    additional_notes: {
      ru: 'Дополнительные заметки',
      en: 'Additional notes',
      kz: 'Қосымша ескертулер'
    },
    additional_notes_placeholder: {
      ru: 'Любые дополнительные пожелания или комментарии',
      en: 'Any additional wishes or comments',
      kz: 'Қосымша талаптар немесе ескертулер'
    },
    // ProductList
    products_not_found: {
      ru: 'Товары не найдены',
      en: 'Products not found',
      kz: 'Тауарлар табылмады'
    },
    try_to_change_filters: {
      ru: 'Попробуйте изменить фильтры поиска',
      en: 'Try to change filters',
      kz: 'Сүзгілерді өзгерту'
    },

    // CheckoutOrderSummary
    your_order: {
      ru: 'Ваш заказ',
      en: 'Your order',
      kz: 'Сіздің тапсырысыңыз'
    },
    checkout_order: {
      ru: 'Оформить заказ',
      en: 'Checkout order',
      kz: 'Тапсырыс беру'
    },
    checkout_order_loading: {
      ru: 'Оформление заказа...',
      en: 'Checkout order loading...',
      kz: 'Тапсырыс беруде...'
    },
    // CollectionsPage
    collections_description: {
      ru: 'Откройте для себя наши уникальные коллекции товаров',
      en: 'Discover our unique collections of products',
      kz: 'Өзіңіздің уникальді жинақтарыңызды ашыңыз'
    },
    collections: {
      ru: 'Коллекции',
      en: 'Collections',
      kz: 'Жинақтар'
    },
    // ProductPage
    product_not_found: {
      ru: 'Товар не найден',
      en: 'Product not found',
      kz: 'Тауар табылмады'
    },
    to_main: {
      ru: 'На главную',
      en: 'To main',
      kz: 'Бастыққа'
    },
    // AddressAutocomplete
    delivery_by_cng: {
      ru: 'Доставка по СНГ',
      en: 'Delivery by CIS countries',
      kz: 'СНГ бойынша жеткізу'
    },
    enter_address: {
      ru: 'Введите адрес',
      en: 'Enter address',
      kz: 'Адресті енгізіңіз'
    },
  };
  
  export const translate = (key: string, language: 'ru' | 'en' | 'kz'): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language];
  };
