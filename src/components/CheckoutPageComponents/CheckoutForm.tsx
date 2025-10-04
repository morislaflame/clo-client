import React, { useState, useCallback } from 'react';
import { Card, CardBody, Input, Textarea, Select, SelectItem, Divider } from '@heroui/react';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface CheckoutFormProps {
  formData: {
    recipientName: string;
    recipientAddress: string;
    recipientPhone?: string;
    recipientEmail?: string;
    paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
    notes: string;
  };
  errors: Record<string, string>;
  isGuest?: boolean;
  onInputChange: (field: string, value: string) => void;
  onAddressValidationChange?: (isValid: boolean, errorMessage?: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = observer(({
  formData,
  errors,
  isGuest = false,
  onInputChange,
  onAddressValidationChange
}) => {
  const { t } = useTranslate();
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    errorMessage?: string;
  }>({ isValid: false });

  const handleAddressValidationChange = useCallback((isValid: boolean, errorMessage?: string) => {
    setAddressValidation({ isValid, errorMessage });
    onAddressValidationChange?.(isValid, errorMessage);
  }, [onAddressValidationChange]);

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult) => {
    // Дополнительная обработка выбранного места при необходимости
    console.log('Selected place:', place);
  }, []);
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Информация о получателе */}
      <Card className="h-auto shadow-none border-none bg-transparent">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">{t("recipient_info")}</h2>
          
          <div className="space-y-4">
            <Input
              label={t("recipient_name")}
              labelPlacement="outside"
              placeholder={t("enter_recipient_name")}
              value={formData.recipientName}
              onValueChange={(value) => onInputChange('recipientName', value)}
              isInvalid={!!errors.recipientName}
              errorMessage={errors.recipientName}
              isRequired
            />
            
            <AddressAutocomplete
              label={t("delivery_address")}
              placeholder={t("start_typing_address")}
              value={formData.recipientAddress}
              onChange={(value) => onInputChange('recipientAddress', value)}
              onPlaceSelect={handlePlaceSelect}
              onValidationChange={handleAddressValidationChange}
              isInvalid={!!errors.recipientAddress || (!addressValidation.isValid && formData.recipientAddress.length > 0)}
              errorMessage={errors.recipientAddress || addressValidation.errorMessage}
              isRequired
            />

            {/* Поля для гостей */}
            {isGuest && (
              <div className="flex flex-col gap-4">
                <Input
                  type="tel"
                  label={t("phone")}
                  labelPlacement="outside"
                  placeholder={t("enter_phone")}
                  value={formData.recipientPhone || ''}
                  onValueChange={(value) => onInputChange('recipientPhone', value)}
                  isInvalid={!!errors.recipientPhone}
                  errorMessage={errors.recipientPhone}
                  isRequired
                />
                
                <Input
                  type="email"
                  label={t("email")}
                  labelPlacement="outside"
                  placeholder={t("enter_email")}
                  value={formData.recipientEmail || ''}
                  onValueChange={(value) => onInputChange('recipientEmail', value)}
                  isInvalid={!!errors.recipientEmail}
                  errorMessage={errors.recipientEmail}
                  isRequired
                />
              </ div>
            )}
            
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">{t("payment_method")}</h2>
          
          <Select
            label={t("select_payment_method")}
            labelPlacement="outside"
            placeholder={t("select_payment_method")}
            selectedKeys={[formData.paymentMethod]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onInputChange('paymentMethod', selected);
            }}
            isInvalid={!!errors.paymentMethod}
            errorMessage={errors.paymentMethod}
            isRequired
          >
            <SelectItem key="CASH" textValue={t("cash")}>{t("cash")}</SelectItem>
            <SelectItem key="CARD" textValue={t("card")}>{t("card")}</SelectItem>
            <SelectItem key="BANK_TRANSFER" textValue={t("bank_transfer")}>{t("bank_transfer")}</SelectItem>
          </Select>
          </div>

          <Divider className="my-4" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t("additional_notes")}</h2>
          
          <Textarea
            placeholder={t("additional_notes_placeholder")}
            value={formData.notes}
            onValueChange={(value) => onInputChange('notes', value)}
            minRows={3}
            />
          </div>
        </CardBody>
      </Card>

    </div>
  );
});

export default CheckoutForm;
