export const isAsyncFunction = (f: unknown) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    (f as Function).constructor.name === 'AsyncFunction' ||
    Object.prototype.toString.call(f) === '[object AsyncFunction]'
  );
};
