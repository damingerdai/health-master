'use client';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { useState } from 'react';
import { AddWeightModal } from './add-weight-modal';
import useSWR from 'swr';
import { fetchWeightRecord } from '@/lib/featcher';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/store/user';
import { WeightManagementList } from './weight-management-list';

export const WeightManagement: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useAtomValue(userAtom);
  const [page, setPage] = useState({ pageNo: 1, pageSize: 5 });
  const { data, isLoading, mutate } = useSWR(
    { url: 'api/weight-records', args: page },
    () => fetchWeightRecord({ ...page, userId: currentUser.id })
  );

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
        <AddWeightModal
          isOpen={isOpen}
          onClose={onClose}
          addWeightModalCallback={mutate}
        />
      </CardHeader>
      <CardBody>
        <WeightManagementList
          data={data?.data ?? []}
          total={data?.count ?? 0}
          page={page.pageNo}
          pageSize={page.pageSize}
          pageChange={p => setPage({ ...page, pageNo: p })}
          isLoading={isLoading}
          refresh={mutate}
        />
      </CardBody>
    </Card>
  );
};
