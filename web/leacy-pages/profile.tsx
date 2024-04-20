import {
  Avatar, Box, Divider, Flex, Text,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import * as React from 'react';
import { ProtectRoute } from '@/components/protect-route';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/store/user';
import { AuthProvider } from '@/components/auth-provider';

const Profile: NextPage = () => {
  const currentUser = useAtomValue(userAtom);
  const {
    username, firstName, lastName, gender,
  } = currentUser;

  return (
    <AuthProvider>
      <Box as="main" pb={8} pl={8} pr={8}>
        <Box pt={4}>
          <Flex flexDir="column" textAlign="center" alignItems="center">
            <Avatar size="lg" name={`${firstName} ${lastName}`} />
            <Text pt={4}>{username}</Text>
          </Flex>
        </Box>
        <Divider w={2} />
        <Box>
          <Flex justifyContent={{ base: 'space-between', md: 'flex-end' }}>
            <Text>性别：</Text>
            <Text>{gender}</Text>
          </Flex>
        </Box>
      </Box>
    </AuthProvider>
  );
};

export default ProtectRoute(Profile);
