import { IWeightRecord } from '@/lib/weight-record';
import {
  Center,
  Spinner,
  Table,
  HStack,
  Box,
  PaginationRootProvider,
} from '@chakra-ui/react';
import * as React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { DeleteWeightRecrodAction } from './delete-weight-record-action';
import { request } from '@/lib/request';
import { toaster } from '@chakra-ui/toaster';
import { Paginator } from './paginator';
import { Tooltip } from '@chakra-ui/tooltip';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationRoot,
} from '@chakra-ui/pagination';

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
      <Box
        className="table-responsive"
        whiteSpace="normal"
        css={{ textWrap: 'normal' }}
      >
        {isLoading ? (
          <Center my={8}>
            <Spinner size="xl"></Spinner>
          </Center>
        ) : (
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.Header>ID</Table.Header>
                <Table.Header>用户名</Table.Header>
                <Table.Header>体重</Table.Header>
                <Table.Header>记录时间</Table.Header>
                <Table.Header>操作</Table.Header>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.map(record => {
                return (
                  <Table.Row key={record.id}>
                    <Table.Cell>{record.id}</Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        content={`${record.user.firstName} ${record.user.lastName}`}
                      >
                        {record.user.username}
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>{record.weight}</Table.Cell>
                    <Table.Cell>{foramtDate(record.recordDate)} </Table.Cell>
                    <Table.Cell>
                      <HStack>
                        <DeleteWeightRecrodAction
                          confirm={async () => {
                            try {
                              const res = await request<{ success: boolean }>({
                                method: 'DELETE',
                                url: `/api/weight-record/${record.id}`,
                              });
                              if (res.success) {
                                toaster.create({
                                  title: '删除体重成功',
                                  status: 'success',
                                  isClosable: true,
                                });
                              }
                              if (refresh) {
                                refresh();
                              }
                            } catch (err) {
                              toaster.create({
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
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
      <PaginationRoot
        count={total}
        pageSize={pageSize}
        page={page}
        pageChange={pageChange}
      >
        <HStack>
          <PaginationRootProvider />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Box>
  );
};
