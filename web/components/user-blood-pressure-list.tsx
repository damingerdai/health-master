import { UserBloodPressures } from '@/type/user-blood-pressure';
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import * as React from 'react';

interface UserBloodPressureListProps {
  userBloodPressures: UserBloodPressures;
}

export const UserBloodPressureList: React.FC<UserBloodPressureListProps> = (
  props,
) => {
  const { userBloodPressures } = props;

  return (
    <Box overflowX="auto">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>姓名</Th>
              <Th>舒张压</Th>
              <Th>收缩压</Th>
              <Th>脉搏</Th>
              <Th>记录时间</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userBloodPressures.map((udp) => (
              <Tr key={udp.id}>
                <Td>{`${udp.user?.firstName} ${udp.user?.lastName}`}</Td>
                <Td>{`${udp.diastolicBloodPressure} mmHg`}</Td>
                <Td>{`${udp.systolicBloodPressure} mmHg`}</Td>
                <Td>{`${udp.pulse} 次/分`}</Td>
                <Td>
                  {udp.logDatetime
                    ? format(new Date(udp.logDatetime), 'PPP', { locale: zhCN })
                    : '未知'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
