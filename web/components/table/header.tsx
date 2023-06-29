import { Th } from '@chakra-ui/react';
import * as React from 'react';

export const TableHeader: React.FC<React.PropsWithChildren> = ({
  children,
}) => <Th fontSize="large">{children}</Th>;
