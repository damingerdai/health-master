import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { UserBloodPressureForm } from '@/components/user-blood-pressure';
import { ProtectRoute } from '@/components/protect-route';
import { Siderbar } from '@/components/sidebar';

const Home: NextPage = () => (
  <Box as="main" pb={8}>
    <Siderbar>
      <UserBloodPressureForm />
    </Siderbar>
  </Box>
);

export default ProtectRoute(Home);
