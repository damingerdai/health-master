'use client';

import { Icon, Link, Box } from '@chakra-ui/react';
import { logout as doLogout, request } from '@/lib/request';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import useSWR from 'swr';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  MenuContent,
  MenuItemGroup,
  MenuRoot,
  MenuItem,
  MenuTrigger,
} from '@/components/ui/menu';
import { Tooltip } from '@/components/ui/tooltip';

export const UserMenu: React.FC = () => {
  const fetcher = async () => {
    const res = await request({
      method: 'GET',
      url: '/api/current-user',
    });

    return res.data;
  };
  const router = useRouter();

  const linkBgColor = useColorModeValue('gray.800', 'gray.200');

  const { data: user } = useSWR('api/current-user', fetcher);
  const { id, username, firstName, lastName } = user ?? {};

  const logout = () => {
    doLogout();
    router.push('/login');
  };

  if (!id) {
    return null;
  }

  return <Avatar size="sm" name={username} />;

  // return (
  //   <MenuRoot positioning={{ placement: 'bottom' }}>
  //     <MenuTrigger asChild>
  //       <Tooltip label={`${firstName} ${lastName}`}>
  //         <Button
  //           cursor="pointer"
  //           py={2}
  //           transform="all 0.3s"
  //           _focus={{ boxShadow: 'none' }}
  //         >
  //           <Avatar size="sm" name={username} />
  //         </Button>
  //       </Tooltip>
  //     </MenuTrigger>
  //     <MenuContent>
  //       <MenuItemGroup>
  //         <MenuItem>
  //           <Avatar mr="6px" size="sm" name={username} />
  //           <span>{`${firstName} ${lastName}`}</span>
  //         </MenuItem>
  //       </MenuItemGroup>
  //       <MenuItemGroup>
  //         <MenuItem>
  //           <Icon mr="12px" ml=".5rem" size="sm" color="orange" as={FaUser} />
  //           <Link href="/profile" color={linkBgColor}>
  //             个人主页
  //           </Link>
  //         </MenuItem>
  //       </MenuItemGroup>
  //       <MenuItemGroup>
  //         <MenuItem onClick={logout}>
  //           <Icon mr="12px" ml=".5rem" size="sm" color="orange" as={FiLogOut} />
  //           <Box as="span">登出</Box>
  //         </MenuItem>
  //       </MenuItemGroup>
  //     </MenuContent>
  //   </MenuRoot>
  // );
};
