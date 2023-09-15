import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import useSWR from 'swr';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { UserBloodPressures } from '@/type/user-blood-pressure';
import { request } from '@/lib/request';
import { AddUserBloodPressureModal } from './add-user-blood-pressure';
import { UserBloodPressureList } from './user-blood-pressure-list';
import { Pagination } from './pagination';

export const UserBloodPressureForm: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  const fetcher = async () => {
    const res = await request<{
      code: number;
      data: { data: UserBloodPressures; count: number };
    }>({
      method: 'GET',
      url: '/api/user_blood_pressures',
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
  } = useSWR(`api/user_blood_pressures?page=${page}`, fetcher);
  const { data, count: sum } = list ?? { data: [], count: 0 };

  useEffect(() => {
    if (!isLoading) {
      setCount(sum);
    }
  }, [isLoading, sum]);

  return (
    <>
      <Box>
        <Flex direction="column" alignItems="start">
          <Heading fontSize="2xl">血压记录</Heading>
          <Button bg="tomato" onClick={onOpen}>
            添加
          </Button>
        </Flex>
        <Divider borderColor="gray.300" my="1rem" />
        <Box>
          {isLoading && (
            <Center>
              <Spinner size="xl" />
            </Center>
          )}
          {!isLoading && data?.length > 0 && (
            <UserBloodPressureList
              userBloodPressures={data}
              onDeleteChange={() => {
                setPage(1);
                mutate();
              }}
            />
          )}
          {!isLoading && data?.length === 0 && <Box h={5} fontSize={24} textAlign='center'>没有血压记录</Box>}
        </Box>
        { !(!isLoading && data?.length === 0) && (<Box>
          <Pagination
            pageSize={5}
            page={page - 1}
            count={count}
            onPageChange={(newPage) => {
              setPage(newPage + 1);
            }}
          />
        </Box>)}
      </Box>
      <AddUserBloodPressureModal
        isOpen={isOpen}
        onClose={() => {
          mutate();
          onClose();
        }}
      />
    </>
  );
};
