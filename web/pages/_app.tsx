import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Fonts } from '../components/fonts';
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Fonts/>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp
