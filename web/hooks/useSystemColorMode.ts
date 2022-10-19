/**
MIT License
Copyright (c) 2018 Johannes Klauss
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
import { useEffect, useState } from 'react';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';
const MODE_DARK = 'dark';
const MODE_LIGHT = 'light';

type ColorMode = 'dark' | 'light';

const isClient = () => typeof window !== 'undefined';

const getMatchMedia = (): MediaQueryList | undefined => (isClient()
  ? window.matchMedia && window.matchMedia(MEDIA_QUERY)
  : undefined);

const getColorMode = (matchQueryList: MediaQueryList | undefined): ColorMode => (matchQueryList && matchQueryList.matches ? MODE_DARK : MODE_LIGHT);

const getBindingEvents = (matchQueryList: MediaQueryList | undefined, handler: () => void): { bindEvent: () => void; unbindEvent: () => void } => {
  if (matchQueryList && matchQueryList.addEventListener) {
    return {
      bindEvent: (): void => matchQueryList.addEventListener('change', handler),
      unbindEvent: (): void => matchQueryList.removeEventListener('change', handler),
    };
  }

  return {
    bindEvent: (): void => matchQueryList && matchQueryList.addListener(handler),
    unbindEvent: (): void => matchQueryList && matchQueryList.removeListener(handler),
  };
};

export function useSystemColorMode(): ColorMode {
  const [colorMode, setColorMode] = useState<ColorMode>(getColorMode(getMatchMedia()));

  const handleChange = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isClient() && window.requestAnimationFrame(() => setColorMode(getColorMode(getMatchMedia())));
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isClient()) {
      const { bindEvent, unbindEvent } = getBindingEvents(getMatchMedia(), handleChange);

      bindEvent();

      return unbindEvent;
    }
  }, []);

  return colorMode;
}
