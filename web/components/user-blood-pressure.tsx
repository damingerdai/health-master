'use client';

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Spinner,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import useSWR from 'swr';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { UserBloodPressures } from '@/type/user-blood-pressure';
import { request } from '@/lib/request';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/store/user';
import { downloadFile } from '@/lib/download-file';
import { AddUserBloodPressureModal } from './add-user-blood-pressure';
import { UserBloodPressureList } from './user-blood-pressure-list';
import { Pagination } from './pagination';

export const UserBloodPressureForm: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const currentUser = useAtomValue(userAtom);

  const fetcher = async () => {
    const res = await request<{
      code: number;
      data: { data: UserBloodPressures; count: number };
    }>({
      method: 'GET',
      url: '/api/user-blood-pressures',
      params: {
        page,
        limit: 5,
      },
    });

    return res.data;
  };
  const {
    data: list,
    isLoading,
    mutate,
  } = useSWR(`api/user-blood-pressures?page=${page}`, fetcher);
  const { data, count: sum } = list ?? { data: [], count: 0 };

  useEffect(() => {
    if (!isLoading) {
      setCount(sum);
    }
  }, [isLoading, sum]);

  return (
    <Box bg={useColorModeValue('white', '#20202380')} borderRadius={6}>
      <Flex
        justifyContent="flex-end"
        py="2"
        pr="2"
        borderLeftWidth="4px"
        borderLeftColor="orange.500"
        borderLeftStyle="solid"
      >
        <Button bg="tomato" onClick={onOpen} mr={1}>
          添加
        </Button>
        <Button
          colorScheme="cyan"
          ml={1}
          onClick={async () => {
            const { downloadUrl } = await request({
              method: 'POST',
              url: '/api/user-blood-pressure/download',
              data: {
                userId: currentUser.id,
              },
            });
            downloadFile(downloadUrl);
          }}
        >
          导出
        </Button>
      </Flex>
      <Divider borderColor="gray.300" />
      <Box>
        {isLoading && (
          <Center my={8}>
            <Spinner size="xl" />
          </Center>
        )}
        {!isLoading && (
          <Box minH="100px">
            {data?.length > 0 ? (
              <UserBloodPressureList
                userBloodPressures={data}
                onDeleteChange={() => {
                  setPage(1);
                  mutate();
                }}
              />
            ) : (
              <Box h={5} my={8} fontSize={24} textAlign="center">
                没有血压记录
              </Box>
            )}
          </Box>
        )}
      </Box>
      {!(!isLoading && data?.length === 0) && (
        <Pagination
          pageSize={5}
          page={page - 1}
          count={count}
          onPageChange={newPage => {
            setPage(newPage + 1);
          }}
        />
      )}
      <AddUserBloodPressureModal
        isOpen={isOpen}
        onClose={() => {
          mutate();
          onClose();
        }}
      />
    </Box>
  );
};
