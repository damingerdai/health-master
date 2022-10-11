import * as React from 'react';
import { memo } from 'react';

export const Fonts: React.MemoExoticComponent<React.FC> = memo(() => 
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;700&display=swap');
  `}</style>
);
