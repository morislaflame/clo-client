import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Spinner, useDisclosure } from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import {
  CheckoutHeader,
  CheckoutForm,
  CheckoutOrderSummary,
  CheckoutSuccessModal
} from "@/components/CheckoutPageComponents";
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
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    errorMessage?: string;
  }>({ isValid: false });

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

  const handleAddressValidationChange = (isValid: boolean, errorMessage?: string) => {
    setAddressValidation({ isValid, errorMessage });
    
    // Очищаем ошибку адреса при успешной валидации
    if (isValid && errors.recipientAddress) {
      setErrors(prev => ({ ...prev, recipientAddress: '' }));
    }
  };

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
        <CheckoutHeader onBackClick={handleBackClick} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CheckoutForm
            formData={formData}
            errors={errors}
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
    </div>
  );
});

export default CheckoutPage;
