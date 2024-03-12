'use client';

import { Box } from '@chakra-ui/react';
import { UserBloodPressureForm } from '@/components/user-blood-pressure';
import { AuthProvider } from '@/components/auth-provider';
import { Layout } from '@/components/layout';

export default function Home() {
  return (
    <Layout>
      <AuthProvider>
        <Box p={2} h="100%">
          <UserBloodPressureForm />
        </Box>
      </AuthProvider>
    </Layout>
  );
}
