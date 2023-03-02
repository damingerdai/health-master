import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, {
  Head, Html, Main, NextScript,
} from 'next/document';
import { ToastContainer } from '../components/toast';
import { theme } from '../lib/theme';

export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="zh">
        <Head>
          <title>Health Master Web</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="health master web" />
          <meta name="author" content="damingerdai" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <ToastContainer />
          <NextScript />
        </body>
      </Html>
    );
  }
}
