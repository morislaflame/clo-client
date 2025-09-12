import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Divider,
  Image,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { MAIN_ROUTE } from "@/utils/consts";

const CheckoutPage = observer(() => {
  const { basket, user, product, order } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const { isOpen: isSuccessModalOpen, onOpen: onSuccessModalOpen, onClose: onSuccessModalClose } = useDisclosure();

  // Форма заказа
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientAddress: '',
    paymentMethod: 'CASH' as 'CASH' | 'CARD' | 'BANK_TRANSFER',
    notes: '',
  });

  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user.isAuth) {
      navigate(MAIN_ROUTE);
      return;
    }

    if (basket.isEmpty) {
      navigate('/basket');
      return;
    }

    // Загружаем корзину при открытии страницы
    basket.loadBasket().catch(console.error);
  }, [user.isAuth, navigate, basket]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'ФИО получателя обязательно';
    }

    if (!formData.recipientAddress.trim()) {
      newErrors.recipientAddress = 'Адрес доставки обязателен';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Способ оплаты обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await order.createOrder(formData);
    
    if (result.success) {
      // Очищаем корзину после успешного создания заказа
      await basket.clearBasket();
      onSuccessModalOpen();
    } else {
      console.error('Ошибка создания заказа:', result.error);
    }
  };

  const handleBackClick = () => {
    navigate('/basket');
  };

  const handleSuccessModalClose = () => {
    onSuccessModalClose();
    navigate(MAIN_ROUTE);
  };


  if (!user.isAuth || basket.isEmpty) {
    return null; // Редирект уже произошел в useEffect
  }

  if (basket.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        {/* Заголовок и кнопка назад */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="light"
            onClick={handleBackClick}
            className="text-default-500"
          >
            ← Назад
          </Button>
          <h1 className="text-2xl font-bold">Оформление заказа</h1>
          <div className="w-32" /> {/* Для выравнивания */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Форма заказа */}
          <div className="lg:col-span-2 space-y-6">
            {/* Информация о получателе */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold mb-4">Информация о получателе</h2>
                
                <div className="space-y-4">
                  <Input
                    label="ФИО получателя"
                    labelPlacement="outside"
                    placeholder="Введите ФИО получателя"
                    value={formData.recipientName}
                    onValueChange={(value) => handleInputChange('recipientName', value)}
                    isInvalid={!!errors.recipientName}
                    errorMessage={errors.recipientName}
                    isRequired
                  />
                  
                  <Textarea
                    label="Адрес доставки"
                    labelPlacement="outside"
                    placeholder="Введите полный адрес доставки"
                    value={formData.recipientAddress}
                    onValueChange={(value) => handleInputChange('recipientAddress', value)}
                    isInvalid={!!errors.recipientAddress}
                    errorMessage={errors.recipientAddress}
                    isRequired
                    minRows={3}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Способ оплаты */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold mb-4">Способ оплаты</h2>
                
                <Select
                  label="Выберите способ оплаты"
                  labelPlacement="outside"
                  placeholder="Выберите способ оплаты"
                  selectedKeys={[formData.paymentMethod]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleInputChange('paymentMethod', selected);
                  }}
                  isInvalid={!!errors.paymentMethod}
                  errorMessage={errors.paymentMethod}
                  isRequired
                >
                  <SelectItem key="CASH">Наличные</SelectItem>
                  <SelectItem key="CARD">Карта</SelectItem>
                  <SelectItem key="BANK_TRANSFER">Банковский перевод</SelectItem>
                </Select>
              </CardBody>
            </Card>

            {/* Дополнительные заметки */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold mb-4">Дополнительные заметки</h2>
                
                <Textarea
                  label="Заметки к заказу (необязательно)"
                  labelPlacement="outside"
                  placeholder="Любые дополнительные пожелания или комментарии"
                  value={formData.notes}
                  onValueChange={(value) => handleInputChange('notes', value)}
                  minRows={3}
                />
              </CardBody>
            </Card>
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardBody className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Ваш заказ</h3>
                
                <Divider />
                
                {/* Список товаров */}
                <div className="space-y-3">
                  {basket.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {/* Изображение товара */}
                      <div className="flex-shrink-0">
                        {item.product.mediaFiles && item.product.mediaFiles.length > 0 ? (
                          <Image
                            src={item.product.mediaFiles[0].url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Нет фото</span>
                          </div>
                        )}
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {item.product.name}
                        </h4>
                        
                        {/* Характеристики */}
                        <div className="text-xs text-default-500 mt-1">
                          {item.selectedSize && (
                            <span>Размер: {item.selectedSize.name}</span>
                          )}
                          {item.selectedSize && item.selectedColor && <span> • </span>}
                          {item.selectedColor && (
                            <span className="flex items-center gap-1">
                              Цвет: 
                              {item.selectedColor.hexCode && (
                                <div 
                                  className="w-2 h-2 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.selectedColor.hexCode }}
                                />
                              )}
                              {item.selectedColor.name}
                            </span>
                          )}
                        </div>
                        
                        {/* Количество и цена */}
                        <div className="text-xs text-default-500 mt-1">
                          Количество: {item.quantity} × {product.currency === 'KZT' 
                            ? `${item.product.priceKZT.toLocaleString()} ₸` 
                            : `$${item.product.priceUSD.toLocaleString()}`
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Divider />
                
                {/* Итого */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Товаров:</span>
                    <span className="font-medium">{basket.totalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Сумма:</span>
                    <span className="font-bold text-lg">
                      {product.currency === 'KZT' 
                        ? `${basket.totalKZT.toLocaleString()} ₸` 
                        : `$${basket.totalUSD.toLocaleString()}`
                      }
                    </span>
                  </div>
                  <div className="text-sm text-default-400">
                    {product.currency === 'KZT' 
                      ? `$${basket.totalUSD.toLocaleString()}` 
                      : `${basket.totalKZT.toLocaleString()} ₸`
                    }
                  </div>
                </div>

                <Divider />

                {/* Кнопка оформления заказа */}
                <Button
                  color="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmitOrder}
                  disabled={order.creating}
                >
                  {order.creating ? (
                    <>
                      <Spinner size="sm" />
                      Оформление заказа...
                    </>
                  ) : (
                    'Оформить заказ'
                  )}
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Модальное окно успешного оформления заказа */}
      <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Заказ успешно оформлен!
              </ModalHeader>
              <ModalBody>
                <p>
                  Ваш заказ был успешно создан. Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.
                </p>
                <p className="text-sm text-default-500 mt-2">
                  Номер заказа: #{order.currentOrder?.id}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="primary" 
                  onPress={handleSuccessModalClose}
                >
                  Понятно
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
});

export default CheckoutPage;
