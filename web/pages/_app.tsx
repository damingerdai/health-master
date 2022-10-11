import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Fonts } from '../components/fonts';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../lib/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      {/* <Fonts/> */}
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp
