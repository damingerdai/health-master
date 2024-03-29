import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { UserBloodPressureForm } from '@/components/user-blood-pressure';
import { ProtectRoute } from '@/components/protect-route';
import { AuthProvider } from '@/components/auth-provider';
import { Layout } from '@/components/layout';

const Home: NextPage = () => (
  <Layout>
    <AuthProvider>
      <Box p={2} h="100%">
        <UserBloodPressureForm />
      </Box>
    </AuthProvider>
  </Layout>
);

export default ProtectRoute(Home);
