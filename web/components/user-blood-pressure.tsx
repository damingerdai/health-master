import { useAppDispatch, useAppSelector } from '@/lib/redux-hooks';
import { fetchUserBloodPressureList } from '@/slices/user-blood-pressure-slice';
import { RequestStatus } from '@/type/request-status';
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
import * as React from 'react';
import { useEffect } from 'react';
import { AddUserBloodPressureModal } from './add-user-blood-pressure';
import { UserBloodPressureList } from './user-blood-pressure-list';

export const UserBloodPressureForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { userBloodPressures, userBloodPressuresStatus } = useAppSelector(
    (state) => state.userBloodPressure,
  );

  useEffect(() => {
    dispatch(fetchUserBloodPressureList());
  }, []);

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
          {userBloodPressuresStatus === RequestStatus.LOADING && (
            <Center>
              {' '}
              <Spinner size="xl" />
            </Center>
          )}
          {userBloodPressuresStatus === RequestStatus.SUCCEEDED && (
            <UserBloodPressureList userBloodPressures={userBloodPressures}/>
          )}
        </Box>
      </Box>
      <AddUserBloodPressureModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
