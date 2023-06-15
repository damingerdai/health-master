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
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/lib/redux-hooks';
import { logout as doLogout } from '@/lib/request';
import { fetchUser, resetUserState } from '@/slices/user-slice';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';

export const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    id, username, firstName, lastName,
  } = useAppSelector(
    (state) => state.user,
  );

  const linkBgColor = useColorModeValue('gray.800', 'gray.200');

  const logout = () => {
    dispatch(resetUserState());
    doLogout();
    router.push('/login');
  };

  useEffect(() => {
    if (!id) {
      dispatch(fetchUser());
    }
  }, [id, dispatch]);

  if (!id) {
    return null;
  }

  return (
    <Menu placement="bottom">
      <MenuButton
        cursor="pointer"
        py={2}
        transform="all 0.3s"
        _focus={{ boxShadow: 'none' }}
      >
        <Avatar size="sm" name={username} />
      </MenuButton>
      <Portal>
        <MenuList maxW={{ base: '6rem', md: '8rem' }}>
          <MenuGroup>
            <MenuItem>
              <Avatar mr="6px" size="sm" name={username} />
              <span>
                {`${firstName} ${lastName}`}
              </span>
            </MenuItem>
          </MenuGroup>
          <MenuGroup>
            <MenuItem>
              <Icon mr="12px" ml=".5rem" size="sm" color="orange" as={FaUser} />
              <Link href="/profile" color={linkBgColor}>个人主页</Link>
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem onClick={logout}>
              <Icon mr="12px" ml=".5rem" size="sm" color="orange" as={FiLogOut} />
              <Box as="span">
                登出
              </Box>
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
};
