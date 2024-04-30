import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import * as React from 'react';
import { useState } from 'react';
import { TableHeader } from '@/components/table';
import {
  UserBloodPressure,
  UserBloodPressures,
} from '@/type/user-blood-pressure';
import { request } from '@/lib/request';
import { DeleteUserBloodPressureModal } from './delete-user-blood-pressure';
import { toastInstance } from './toast';

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
      toastInstance({
        title: '删除成功',
        status: 'success',
        isClosable: true,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      toastInstance({
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
      <TableContainer
        className="table-responsive"
        whiteSpace="normal"
        __css={{ textWrap: 'nowrap' }}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <TableHeader>姓名</TableHeader>
              <TableHeader>舒张压</TableHeader>
              <TableHeader>收缩压</TableHeader>
              <TableHeader>脉搏</TableHeader>
              <TableHeader>记录时间</TableHeader>
              <TableHeader>操作</TableHeader>
            </Tr>
          </Thead>
          <Tbody>
            {userBloodPressures.map(ubp => (
              <Tr key={ubp.id}>
                <Td>{`${ubp.user?.firstName} ${ubp.user?.lastName}`}</Td>
                <Td>{`${ubp.diastolicBloodPressure} mmHg`}</Td>
                <Td>{`${ubp.systolicBloodPressure} mmHg`}</Td>
                <Td>{`${ubp.pulse} 次/分`}</Td>
                <Td>
                  {ubp.logDatetime
                    ? format(new Date(ubp.logDatetime), 'PPPp', {
                      locale: zhCN,
                    })
                    : '未知'}
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      setSelecetedUserBloodPressure(ubp);
                      onOpen();
                    }}
                  >
                    删除
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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
