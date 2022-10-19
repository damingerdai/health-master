import * as React from 'react';
import { memo } from 'react';

// eslint-disable-next-line react/display-name
export const Fonts: React.MemoExoticComponent<React.FC> = Object.assign(memo(() => (
  <style jsx global>
    {`
    @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;700&display=swap');
  `}
  </style>
)), { displayName: 'Fonts' });
