import React from 'react';
import { Card, CardBody, Input, Textarea, Select, SelectItem } from '@heroui/react';

interface CheckoutFormProps {
  formData: {
    recipientName: string;
    recipientAddress: string;
    paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
    notes: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
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
              onValueChange={(value) => onInputChange('recipientName', value)}
              isInvalid={!!errors.recipientName}
              errorMessage={errors.recipientName}
              isRequired
            />
            
            <Textarea
              label="Адрес доставки"
              labelPlacement="outside"
              placeholder="Введите полный адрес доставки"
              value={formData.recipientAddress}
              onValueChange={(value) => onInputChange('recipientAddress', value)}
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
            onValueChange={(value) => onInputChange('notes', value)}
            minRows={3}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CheckoutForm;
