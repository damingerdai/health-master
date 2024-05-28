'use client';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { AddWeightModal } from './add-weight-modal';

export const WeightManagement: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card w="full">
      <CardHeader
        display="flex"
        justifyContent="flex-end"
        borderLeftWidth="4px"
        borderLeftColor="orange.500"
        borderLeftStyle="solid"
        borderBottom="1px solid #E3E8F0"
      >
        <Button bg="tomato" onClick={onOpen}>
          添加
        </Button>
        <AddWeightModal isOpen={isOpen} onClose={onClose} />
      </CardHeader>
      <CardBody>TABLE</CardBody>
    </Card>
  );
};
