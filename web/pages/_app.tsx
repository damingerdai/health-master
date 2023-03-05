import { Fonts } from '@/components/fonts';
import { toastInstance } from '@/components/toast';
import { theme } from '@/lib/theme';
import { store } from '@/store';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../styles/globals.scss';
import { Router } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

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
    <Provider store={store}>
      <ChakraProvider theme={theme}>
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
    </Provider>
  );
}

export default MyApp;
