import { Center, CircularProgress } from '@chakra-ui/react';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');

  return (
    <Center h="100vh">
      <CircularProgress isIndeterminate color="teal.400" />
    </Center>
  );
}
