import { Center } from '@chakra-ui/react';
import {
  ProgressCircleRoot,
  ProgressCircleRing,
} from '@/components/ui/progress-circle';
import * as React from 'react';

export const GlobalLoading = React.memo(() => (
  <Center w="100%" h="100%" boxSizing="border-box">
    <ProgressCircleRoot size="xl" value={null}>
      <ProgressCircleRing cap="round" />
    </ProgressCircleRoot>
  </Center>
));

GlobalLoading.displayName = 'GlobalLoading';
