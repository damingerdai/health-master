export function formatTimestampToGinFormat(timestampString: string): string {
  // Convert the timestamp string to a Date object
  const date: Date = new Date(timestampString);

  // Format the date to RFC 3339 without milliseconds
  const ginFormattedTimestamp: string = date
    .toISOString()
    .replace(/\.[0-9]*Z$/, 'Z');

  return ginFormattedTimestamp;
}

export function formatDateToGinFormat(dateObject: Date): string {
  // Format the date object to RFC 3339 without milliseconds
  const ginFormattedTimestamp: string = dateObject
    .toISOString()
    .replace(/\.[0-9]*Z$/, 'Z');

  return ginFormattedTimestamp;
}
