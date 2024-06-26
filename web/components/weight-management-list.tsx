import { IWeightRecord } from '@/lib/weight-record';
import {
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
  Td,
  Tooltip,
} from '@chakra-ui/react';
import * as React from 'react';
import { TableHeader } from './table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface WeightManagementListProps {
  data: IWeightRecord[];
  isLoading: boolean;
}

export const WeightManagementList: React.FC<
  WeightManagementListProps
> = props => {
  const { data, isLoading } = props;

  const foramtDate = (date: string | Date) => {
    if (!date) {
      return '未知';
    }
    if (typeof date === 'string') {
      return foramtDate(new Date(date));
    }

    return format(date, 'PPPp', { locale: zhCN });
  };

  return (
    <TableContainer
      className="table-responsive"
      whiteSpace="normal"
      __css={{ textWrap: 'normal' }}
    >
      {isLoading ? (
        <Center my={8}>
          <Spinner size="xl"></Spinner>
        </Center>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>用户名</TableHeader>
              <TableHeader>体重</TableHeader>
              <TableHeader>记录时间</TableHeader>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(record => {
              return (
                <Tr key={record.id}>
                  <Td>{record.id}</Td>
                  <Td>
                    <Tooltip
                      aria-label="user name"
                      label={`${record.user.firstName} ${record.user.lastName}`}
                    >
                      {record.user.username}
                    </Tooltip>
                  </Td>
                  <Td>{record.weight}</Td>
                  <Td>{foramtDate(record.recordDate)} </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </TableContainer>
  );
};
