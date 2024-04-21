import {
  useColorModeValue,
  Avatar,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import { logout as doLogout, request } from '@/lib/request';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import useSWR from 'swr';

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

  return (
    <Menu placement="bottom">
      <Tooltip label={`${firstName} ${lastName}`}>
        <MenuButton
          cursor="pointer"
          py={2}
          transform="all 0.3s"
          _focus={{ boxShadow: 'none' }}
        >
          <Avatar size="sm" name={username} />
        </MenuButton>
      </Tooltip>
      <Portal>
        <MenuList maxW={{ base: '6rem', md: '8rem' }}>
          <MenuGroup>
            <MenuItem>
              <Avatar mr="6px" size="sm" name={username} />
              <span>{`${firstName} ${lastName}`}</span>
            </MenuItem>
          </MenuGroup>
          <MenuGroup>
            <MenuItem>
              <Icon mr="12px" ml=".5rem" size="sm" color="orange" as={FaUser} />
              <Link href="/profile" color={linkBgColor}>
                个人主页
              </Link>
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem onClick={logout}>
              <Icon
                mr="12px"
                ml=".5rem"
                size="sm"
                color="orange"
                as={FiLogOut}
              />
              <Box as="span">登出</Box>
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
};
