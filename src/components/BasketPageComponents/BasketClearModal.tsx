import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner
} from '@heroui/react';

interface BasketClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const BasketClearModal: React.FC<BasketClearModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Очистить корзину
            </ModalHeader>
            <ModalBody>
              <p>
                Вы уверены, что хотите удалить все товары из корзины? 
              </p>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="default" 
                variant="light" 
                onPress={onClose}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button 
                color="danger" 
                onPress={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    Удаление...
                  </>
                ) : (
                  'Удалить все'
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BasketClearModal;
