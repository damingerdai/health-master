import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import * as React from 'react';
import { useState } from 'react';
import { Button } from '@chakra-ui/button';
import { Table } from '@chakra-ui/react';
import {
  UserBloodPressure,
  UserBloodPressures,
} from '@/type/user-blood-pressure';
import { request } from '@/lib/request';
import { DeleteUserBloodPressureModal } from './delete-user-blood-pressure';
import { useDisclosure } from '@reactuses/core';
import { toaster } from '@chakra-ui/toaster';

interface UserBloodPressureListProps {
  userBloodPressures: UserBloodPressures;
  onDeleteChange: () => void;
}

export const UserBloodPressureList: React.FC<
  UserBloodPressureListProps
> = props => {
  const { userBloodPressures, onDeleteChange } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUserBloodPressure, setSelecetedUserBloodPressure] = useState<
    UserBloodPressure | undefined
  >(undefined);
  const onDoClose = () => {
    onClose();
    setSelecetedUserBloodPressure(undefined);
  };

  const deleteUserBloodPressure = async (ubp: UserBloodPressure) => {
    try {
      await request({
        method: 'DELETE',
        url: `/api/user-blood-pressure/${ubp.id}`,
      });
      toaster.create({
        title: '删除成功',
        status: 'success',
        isClosable: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      toaster.create({
        title: '删除失败',
        description: ex.message,
        status: 'error',
        isClosable: true,
      });
    }
    onDoClose();
  };

  return (
    <>
      <Table.Root
        className="table-responsive"
        whiteSpace="normal"
        css={{ textWrap: 'nowrap' }}
      >
        <Table.Header>
          <Table.Row>
            <Header.ColumnHeader>姓名</Header.ColumnHeader>
            <Header.ColumnHeader>舒张压</Header.ColumnHeader>
            <Header.ColumnHeader>收缩压</Header.ColumnHeader>
            <Header.ColumnHeader>脉搏</Header.ColumnHeader>
            <Header.ColumnHeader>记录时间</Header.ColumnHeader>
            <Header.ColumnHeader>操作</Header.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userBloodPressures.map(ubp => (
            <Table.Row key={ubp.id}>
              <Table.Cell>{`${ubp.user?.firstName} ${ubp.user?.lastName}`}</Table.Cell>
              <Table.Cell>{`${ubp.diastolicBloodPressure} mmHg`}</Table.Cell>
              <Table.Cell>{`${ubp.systolicBloodPressure} mmHg`}</Table.Cell>
              <Table.Cell>{`${ubp.pulse} 次/分`}</Table.Cell>
              <Table.Cell>
                {ubp.logDatetime
                  ? format(new Date(ubp.logDatetime), 'PPPp', {
                      locale: zhCN,
                    })
                  : '未知'}
              </Table.Cell>
              <Table.Cell>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setSelecetedUserBloodPressure(ubp);
                    onOpen();
                  }}
                >
                  删除
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <DeleteUserBloodPressureModal
        isOpen={isOpen}
        onClose={onDoClose}
        confirm={async () => {
          if (selectedUserBloodPressure) {
            await deleteUserBloodPressure(selectedUserBloodPressure);
            onDeleteChange();
          }
        }}
      />
    </>
  );
};
