import { Center, CircularProgress } from '@chakra-ui/react';
import * as React from 'react';

export const GlobalLoading = React.memo(() => <Center w="100%" h="100%" boxSizing="border-box"><CircularProgress isIndeterminate /></Center>);

GlobalLoading.displayName = 'GlobalLoading';
