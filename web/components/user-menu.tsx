import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { logout as doLogout } from "@/lib/request";
import { fetchUser, resetUserState } from "@/slices/user-slice";
import {
  Avatar,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";

export const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id, username, firstName, lastName } = useAppSelector(
    (state) => state.user
  );

  const logout = async () => {
    await dispatch(resetUserState())
    doLogout();
    router.push('/login');
  }

  useEffect(() => {
    if (!id) {
      dispatch(fetchUser());
    }
  }, []);

  if (!id) {
    return null;
  }

  return (
    <Menu placement="bottom">
      <MenuButton
        cursor="pointer"
        py={2}
        transform="all 0.3s"
        _focus={{ boxShadow: "none" }}
      >
        <Avatar size="sm" name={username} />
      </MenuButton>
      <MenuList maxW={{ base: "6rem", md: "8rem" }}>
        <MenuGroup>
          <MenuItem>
            <Avatar mr="6px" size="sm" name={username} />
            <span> {`${firstName} ${lastName}`}</span>
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem onClick={logout}>
            <Icon mr="12px" ml=".5rem" size="sm" color="orange" as={FiLogOut} />
            <span>
                登出 
            </span> 
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
