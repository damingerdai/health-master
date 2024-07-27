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
import * as React from 'react';

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mt={{ base: '50%', sm: '10%' }}>
        <ModalHeader>确定删除？</ModalHeader>
        <ModalCloseButton />
        <ModalBody>一旦删除将无法撤销！！！</ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            取消
          </Button>
          <Button variant="ghost" color="red" onClick={confirm}>
            确定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
