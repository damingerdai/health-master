'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { isAsyncFunction } from '@/lib/fn';

interface ConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  confirm: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
}

export const Confirm: React.FC<ConfirmProps> = props => {
  const {
    isOpen,
    onClose,
    confirm,
    title,
    description,
    cancelText,
    confirmText,
  } = props;

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const doConfirm = async () => {
    setConfirmLoading(true);
    const handler = (
      isAsyncFunction(confirm)
        ? confirm
        : () => {
          confirm();

          return Promise.reject();
        }
    ) as () => Promise<void>;

    await handler();
    setConfirmLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mt={{ base: '50%', sm: '10%' }}>
        <ModalHeader>{title ?? '确认'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description ?? '请确认'}</ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            {cancelText ?? '取消'}
          </Button>
          <Button
            colorScheme="ghost"
            color="red"
            isLoading={confirmLoading}
            onClick={doConfirm}
          >
            {confirmText ?? '确定'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
