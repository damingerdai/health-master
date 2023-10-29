const isChrome = () => navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
const isSafari = () => navigator.userAgent.toLowerCase().indexOf('safari') > -1;

export const downloadFile = (sUrl: string): boolean => {
  if (/(iP)/g.test(navigator.userAgent)) {
    alert('Your device does not support files downloading. Please try again in desktop browser.');
    return false;
  }

  if (isChrome() || isSafari()) {
    // Creating new link node.
    const link = document.createElement('a');
    link.href = sUrl;

    if (link.download !== undefined) {
      // Set HTML5 download attribute. This will prevent file from opening if supported.
      const fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
      link.download = fileName;
    }

    // Dispatching click event.
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }

    if (sUrl.indexOf('?') === -1) {
      sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
  }

  return false;
};
