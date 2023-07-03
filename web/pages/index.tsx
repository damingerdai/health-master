import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { UserBloodPressureForm } from '@/components/user-blood-pressure';
import { ProtectRoute } from '@/components/protect-route';
import { Siderbar } from '@/components/sidebar';
import { AuthProvider } from '@/components/auth-provider';

const Home: NextPage = () => (
  <AuthProvider>
    <Box as="main" pb={8}>
      <Siderbar>
        <UserBloodPressureForm />
      </Siderbar>
    </Box>
  </AuthProvider>
);

export default ProtectRoute(Home);
