import { Box, Button, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import { Confirm } from './confirm';

interface DeleteWeightRecrodActionProps {
  confirm: () => void;
}

export const DeleteWeightRecrodAction: React.FC<
  DeleteWeightRecrodActionProps
> = props => {
  const { confirm } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button colorScheme="red" onClick={onOpen}>
        删除
      </Button>
      <Confirm
        isOpen={isOpen}
        onClose={onClose}
        confirm={confirm}
        title="确定删除？"
        description="一旦删除将无法撤销！！！"
      ></Confirm>
    </Box>
  );
};
