import { Avatar, Box, Center, Divider, Flex, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import * as React from "react";
import { useEffect } from "react";
import { ProtectRoute } from "@/components/protect-route";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { fetchUser } from "@/slices/user-slice";

const Profile: NextPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(
    (state) => state.user
  );
  const { id, username, firstName, lastName, gender } = currentUser;

  useEffect(() => {
    if (!id) {
      dispatch(fetchUser());
    }
  }, []);

  console.log(currentUser);

  return (
    <Box as="main" pb={8} pl={8} pr={8}>
      <Box pt={4}>
        <Flex flexDir="column" textAlign="center" alignItems="center">
          <Avatar size="lg" name={`${firstName} ${lastName}`}/>
          <Text pt={4}>{username}</Text>
        </Flex>
      </Box>
      <Divider w={2}/>
      <Box>
        <Flex justifyContent={{ base: 'space-between', md: 'flex-end' }}>
            <Text>性别：</Text>
            <Text>{gender}</Text> 
        </Flex>
      
      </Box>
    </Box>
  );
};

export default ProtectRoute(Profile);
