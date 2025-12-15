'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@chakra-ui/button';
import { DialogBackdrop, DialogBody, DialogRoot } from '@chakra-ui/dialog';
import { isAsyncFunction } from '@/lib/fn';
import {
  DialogActionTrigger,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@chakra-ui/react';

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

            return Promise.resolve();
          }
    ) as () => Promise<void>;

    await handler();
    setConfirmLoading(false);
    onClose();
  };

  return (
    <DialogRoot isOpen={isOpen} onClose={onClose}>
      <DialogBackdrop />
      <DialogTrigger />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>{title ?? '确认'}</DialogTitle>
        </DialogHeader>
        <DialogBody>{description ?? '确认'}</DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              {cancelText ?? '取消'}
            </Button>
            <Button
              colorScheme="ghost"
              color="red"
              loading={confirmLoading}
              onClick={doConfirm}
            >
              {confirmText ?? '确定'}
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
