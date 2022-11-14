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

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    function clearToast() {
      toastInstance.closeAll();
    }
    Router.events.on('routeChangeStart', clearToast);

    return () => {
      Router.events.off('routeChangeStart', clearToast);
    }
  }, [])


  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
