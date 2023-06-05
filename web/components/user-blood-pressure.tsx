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
import { UserBloodPressures } from '@/type/user-blood-pressure';
import { request } from '@/lib/request';
import { AddUserBloodPressureModal } from './add-user-blood-pressure';
import { UserBloodPressureList } from './user-blood-pressure-list';

export const UserBloodPressureForm: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fetcher = async () => {
    const res = await request<{ data: UserBloodPressures }>({
      method: 'GET',
      url: '/api/user_blood_pressures',
    });
    return res.data;
  };
  const { data, isLoading, mutate } = useSWR('api/user_blood_pressures', fetcher);

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
          { isLoading && (
            <Center>
              <Spinner size="xl" />
            </Center>
          )}
          { !isLoading && data && (
            <UserBloodPressureList userBloodPressures={data} />
          )}
        </Box>
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
