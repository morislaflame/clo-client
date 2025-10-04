import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useDisclosure } from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import {
  CheckoutHeader,
  CheckoutForm,
  CheckoutOrderSummary,
  CheckoutSuccessModal
} from "@/components/CheckoutPageComponents";
import { MAIN_ROUTE } from "@/utils/consts";
import PageWrapper from "@/components/PageWrapper";
import LoadingPage from "@/components/LoadingPage";
import { useTranslate } from "@/utils/useTranslate";

const CheckoutPage = observer(() => {
  const { basket, product, order } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const { isOpen: isSuccessModalOpen, onOpen: onSuccessModalOpen, onClose: onSuccessModalClose } = useDisclosure();
  const { t } = useTranslate();
  // Определяем, гость ли пользователь (используем геттер из basket)
  const isGuest = basket.isGuest;

  // Форма заказа
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientAddress: '',
    recipientPhone: '', // Для гостей
    recipientEmail: '', // Для гостей
    paymentMethod: 'CASH' as 'CASH' | 'CARD' | 'BANK_TRANSFER',
    notes: '',
  });

  // Валидация
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    errorMessage?: string;
  }>({ isValid: false });

  useEffect(() => {
    if (basket.isEmpty) {
      navigate('/basket');
      return;
    }

    // Загружаем корзину при открытии страницы
    basket.loadBasket().catch(console.error);
  }, [navigate, basket]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    setErrors(prev => {
      if (prev[field]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleAddressValidationChange = useCallback((isValid: boolean, errorMessage?: string) => {
    setAddressValidation({ isValid, errorMessage });
    
    // Очищаем ошибку адреса при успешной валидации
    if (isValid) {
      setErrors(prev => {
        if (prev.recipientAddress) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { recipientAddress: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'ФИО получателя обязательно';
    }

    if (!formData.recipientAddress.trim()) {
      newErrors.recipientAddress = 'Адрес доставки обязателен';
    } else if (!addressValidation.isValid) {
      newErrors.recipientAddress = addressValidation.errorMessage || 'Пожалуйста, выберите адрес из предложенных вариантов';
    }

    // Для гостей обязательны телефон и email
    if (isGuest) {
      if (!formData.recipientPhone.trim()) {
        newErrors.recipientPhone = 'Телефон обязателен';
      }
      if (!formData.recipientEmail.trim()) {
        newErrors.recipientEmail = 'Email обязателен';
      } else if (!/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
        newErrors.recipientEmail = 'Некорректный email';
      }
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

    // Передаем basketStore для гостевых заказов
    const result = await order.createOrder(formData, basket);
    
    if (result.success) {
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


  if (basket.loading) {
    return <LoadingPage message={t("loading_basket")} />;
  }

  return (
    <PageWrapper className="min-h-screen">
      <div className="container mx-auto p-4">
        <CheckoutHeader onBackClick={handleBackClick} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CheckoutForm
            formData={formData}
            errors={errors}
            isGuest={isGuest}
            onInputChange={handleInputChange}
            onAddressValidationChange={handleAddressValidationChange}
          />

          <CheckoutOrderSummary
            items={basket.items}
            totalCount={basket.totalCount}
            totalKZT={basket.totalKZT}
            totalUSD={basket.totalUSD}
            currency={product.currency}
            onSubmitOrder={handleSubmitOrder}
            isCreating={order.creating}
          />
        </div>
      </div>

      <CheckoutSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        orderId={order.currentOrder?.id}
      />
    </PageWrapper>
  );
});

export default CheckoutPage;
