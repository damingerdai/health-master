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
  HStack,
  Box,
} from '@chakra-ui/react';
import * as React from 'react';
import { TableHeader } from './table';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { DeleteWeightRecrodAction } from './delete-weight-record-action';
import { request } from '@/lib/request';
import { toastInstance } from './toast';
import { Paginator } from './paginator';

interface WeightManagementListProps {
  data: IWeightRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageChange: (page: number) => void;
  isLoading: boolean;

  refresh?: () => void;
}

export const WeightManagementList: React.FC<
  WeightManagementListProps
> = props => {
  const { data, total, page, pageSize, pageChange, isLoading, refresh } = props;

  const foramtDate = (date: string | Date) => {
    if (!date) {
      return '未知';
    }
    if (typeof date === 'string') {
      return foramtDate(new Date(date));
    }

    return format(date, 'PPPp', { locale: zhCN });
  };

  if (isLoading) {
    return (
      <Center my={8}>
        <Spinner size="xl"></Spinner>
      </Center>
    );
  }

  return (
    <Box>
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
                <TableHeader>操作</TableHeader>
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
                    <Td>
                      <HStack>
                        <DeleteWeightRecrodAction
                          confirm={async () => {
                            try {
                              const res = await request<{ success: boolean }>({
                                method: 'DELETE',
                                url: `/api/weight-record/${record.id}`,
                              });
                              if (res.success) {
                                toastInstance({
                                  title: '删除体重成功',
                                  status: 'success',
                                  isClosable: true,
                                });
                              }
                              if (refresh) {
                                refresh();
                              }
                            } catch (err) {
                              toastInstance({
                                id: 'SERVICE_ERROR',
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                title: (err as any).message,
                                position: 'bottom',
                                status: 'error',
                                duration: 9000,
                                isClosable: true,
                              });
                            }
                          }}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </TableContainer>
      <Paginator
        page={page}
        total={Math.ceil(total / pageSize)}
        pageChange={pageChange}
      />
    </Box>
  );
};
