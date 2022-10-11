import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import { theme } from '../lib/theme';

export default class Document extends NextDocument {
    render(): JSX.Element {
        return (
            <Html lang="zh">
                <Head/>
                <body>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}