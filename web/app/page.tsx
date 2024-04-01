'use client';

import { toastInstance } from '@/components/toast';
import {
  Button, Center, Container, Text,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Container>
      <Center>
        <Text> Health Master App</Text>
        <Button onClick={() => {
          toastInstance({
            title: 'hello world',
            status: 'success',
          });
        }}
        >
          click
        </Button>
      </Center>
    </Container>
  );
}
