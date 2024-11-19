import * as React from 'react';
import { Button } from '@chakra-ui/button';
import { DialogRoot } from '@chakra-ui/react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@chakra-ui/dialog';

interface DeleteUserBloodPressureModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirm: () => void;
}

export const DeleteUserBloodPressureModal: React.FC<
  DeleteUserBloodPressureModalProps
> = props => {
  const { isOpen, onClose, confirm } = props;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={details => {
        if (details.open) {
          onClose();
        }
      }}
    >
      <DialogContent mt={{ base: '50%', sm: '10%' }}>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>确认删除？</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>一旦删除将无法撤销！！！</p>
        </DialogBody>
        <DialogFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            取消
          </Button>
          <Button variant="ghost" color="red" onClick={confirm}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
