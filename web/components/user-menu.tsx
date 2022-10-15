import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { fetchUser } from "@/slices/user-slice";
import {
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuIcon,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";

export const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id, username, firstName, lastName } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!id) {
        dispatch(fetchUser());
    }
  }, [])

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
      <MenuList maxW={{ base: '6rem', md: '8rem' }}>
        <MenuGroup>
          <MenuItem>
            <Avatar mr="6px" size="sm" name={username} />
            <span> {`${firstName} ${lastName}`}</span>
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
      </MenuList>
    </Menu>
  );
};
