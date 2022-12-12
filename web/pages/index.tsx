import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { UserBloodPressureForm } from '@/components/user-blood-pressure';
import { ProtectRoute } from '@/components/protect-route';
import { Siderbar } from '@/components/sidebar';
import { Picker } from '@/components/picker';

const Home: NextPage = () => (
  <Box as="main" pb={8}>
    <Head>
      <title>Health Master Web</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="health master web" />
      <meta name="author" content="damingerdai" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Siderbar>
      <UserBloodPressureForm />
    </Siderbar>
  </Box>
);

export default ProtectRoute(Home);
