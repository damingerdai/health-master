'use client';

import * as React from 'react';
import { Link as NextLink, LinkProps } from '@chakra-ui/next-js';

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const { children, ...rest } = props;

    return (
      <NextLink ref={ref} {...rest}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';
