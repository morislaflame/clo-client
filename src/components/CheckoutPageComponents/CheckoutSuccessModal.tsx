import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react';

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: number;
}

const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  isOpen,
  onClose,
  orderId
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="dark">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-default-900">
              Заказ успешно оформлен!
            </ModalHeader>
            <ModalBody>
              <p className="text-default-700">
                Ваш заказ был успешно создан. Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.
              </p>
              {orderId && (
                <p className="text-lg font-medium text-default-900 mt-2">
                  Номер заказа: #{orderId}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button 
                color="default" 
                onPress={onClose}
              >
                Понятно
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CheckoutSuccessModal;
