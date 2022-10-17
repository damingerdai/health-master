import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { AddUserBloodPressureModal } from './add-user-blood-pressure';

export const UserBloodPressureForm: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Flex direction="column" alignItems="start">
          <Heading fontSize="4xl">血压记录</Heading>
          <Button bg="tomato" onClick={onOpen}>添加</Button>
        </Flex>
        <Divider borderColor="gray.300" my="1rem" />
        <Box>hello</Box>
      </Box>
      <AddUserBloodPressureModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
