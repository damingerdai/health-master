/* eslint-disable react/no-unknown-property */
import * as React from 'react';

export const Fonts: React.MemoExoticComponent<React.FC> = React.memo(() => (
  <>
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <style jsx global>
      {`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;700&display=swap');
      `}
    </style>
  </>
));

Fonts.displayName = 'Fonts';
