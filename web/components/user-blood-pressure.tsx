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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';
import { AddUserBloodPressureModal } from './add-user-blood-pressure';

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
            <Box overflowX="auto">
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>姓名</Th>
                      <Th>舒张压</Th>
                      <Th>收缩压</Th>
                      <Th>脉搏</Th>
                      <Th>创建时间</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userBloodPressures.map((udp) => (
                      <Tr key={udp.id}>
                        <Td>{`${udp.user?.firstName} ${udp.user?.lastName}`}</Td>
                        <Td>{`${udp.diastolicBloodPressure} mmHg`}</Td>
                        <Td>{`${udp.systolicBloodPressure} mmHg`}</Td>
                        <Td>{`${udp.pulse} 次/分`}</Td>
                        <Td>{udp.createdAt?.toString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>
      <AddUserBloodPressureModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
