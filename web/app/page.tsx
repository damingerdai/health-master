import { GlobalLoading } from '@/components/loading';
import {
  Container,
} from '@chakra-ui/react';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');

  return (
    <Container>
      <GlobalLoading />
    </Container>
  );
}
