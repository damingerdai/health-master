import { Box, LinkBoxProps } from '@chakra-ui/react';
import NextLink from 'next/link';

export const BrowserLink: React.FC<React.PropsWithChildren<LinkBoxProps & { href: string }>> = (props) => {
  const { children, href, ...rest } = props;

  return (
    <NextLink href={href} passHref>
      {/* <Box as="a">{children}</Box> */}
      {children}
    </NextLink>
  );
};
