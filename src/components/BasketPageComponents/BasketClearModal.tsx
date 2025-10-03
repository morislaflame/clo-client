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
import { observer } from 'mobx-react-lite';
import { useTranslate } from '@/utils/useTranslate';

interface BasketClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const BasketClearModal: React.FC<BasketClearModalProps> = observer(({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  const { t } = useTranslate();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t("clear_basket")}
            </ModalHeader>
            <ModalBody>
              <p>
                {t("clear_basket_confirmation")}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="default" 
                variant="light" 
                onPress={onClose}
                disabled={isLoading}
              >
                {t("cancel")}
              </Button>
              <Button 
                color="danger" 
                onPress={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    {t("deleting")}
                  </>
                ) : (
                  <>
                  {t("delete_all")}
                  </>
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default BasketClearModal;
