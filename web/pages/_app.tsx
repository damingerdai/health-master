import { Fonts } from '@/components/fonts';
import { toastInstance } from '@/components/toast';
import { theme } from '@/lib/theme';
import { Provider as JotaiProvider } from 'jotai';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import '../styles/globals.scss';
import '../styles/reset.scss';
import { Router } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import { appStore } from '@/store';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    function clearToast() {
      toastInstance.closeAll();
    }
    Router.events.on('routeChangeStart', clearToast);

    return () => {
      Router.events.off('routeChangeStart', clearToast);
    };
  }, []);

  return (
    <JotaiProvider store={appStore}>
      <ChakraProvider theme={theme} resetCSS>
        <Fonts />
        <Head>
          <title>Health Master Web</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="health master web" />
          <meta name="author" content="damingerdai" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </JotaiProvider>
  );
}

export default MyApp;
