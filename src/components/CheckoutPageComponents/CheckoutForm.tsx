import React, { useState } from 'react';
import { Card, CardBody, Input, Textarea, Select, SelectItem, Divider } from '@heroui/react';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';

interface CheckoutFormProps {
  formData: {
    recipientName: string;
    recipientAddress: string;
    paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
    notes: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onAddressValidationChange?: (isValid: boolean, errorMessage?: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  errors,
  onInputChange,
  onAddressValidationChange
}) => {
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    errorMessage?: string;
  }>({ isValid: false });

  const handleAddressValidationChange = (isValid: boolean, errorMessage?: string) => {
    setAddressValidation({ isValid, errorMessage });
    onAddressValidationChange?.(isValid, errorMessage);
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    // Дополнительная обработка выбранного места при необходимости
    console.log('Selected place:', place);
  };
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Информация о получателе */}
      <Card className="h-auto shadow-none border-none bg-transparent">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">Информация о получателе</h2>
          
          <div className="space-y-4">
            <Input
              label="ФИО получателя"
              labelPlacement="outside"
              placeholder="Введите ФИО получателя"
              value={formData.recipientName}
              onValueChange={(value) => onInputChange('recipientName', value)}
              isInvalid={!!errors.recipientName}
              errorMessage={errors.recipientName}
              isRequired
            />
            
            <AddressAutocomplete
              label="Адрес доставки"
              placeholder="Начните вводить адрес для автодополнения"
              value={formData.recipientAddress}
              onChange={(value) => onInputChange('recipientAddress', value)}
              onPlaceSelect={handlePlaceSelect}
              onValidationChange={handleAddressValidationChange}
              isInvalid={!!errors.recipientAddress || (!addressValidation.isValid && formData.recipientAddress.length > 0)}
              errorMessage={errors.recipientAddress || addressValidation.errorMessage}
              isRequired
            />
            
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Способ оплаты</h2>
          
          <Select
            label="Выберите способ оплаты"
            labelPlacement="outside"
            placeholder="Выберите способ оплаты"
            selectedKeys={[formData.paymentMethod]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onInputChange('paymentMethod', selected);
            }}
            isInvalid={!!errors.paymentMethod}
            errorMessage={errors.paymentMethod}
            isRequired
          >
            <SelectItem key="CASH">Наличные</SelectItem>
            <SelectItem key="CARD">Карта</SelectItem>
            <SelectItem key="BANK_TRANSFER">Банковский перевод</SelectItem>
          </Select>
          </div>

          <Divider className="my-4" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Дополнительные заметки</h2>
          
          <Textarea
            placeholder="Любые дополнительные пожелания или комментарии"
            value={formData.notes}
            onValueChange={(value) => onInputChange('notes', value)}
            minRows={3}
            />
          </div>
        </CardBody>
      </Card>

    </div>
  );
};

export default CheckoutForm;
