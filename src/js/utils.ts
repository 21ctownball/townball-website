export function getFormattedDatetime(datetime: string) {
  let result: string;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(undefined, options);
  try {
    result = formatter.format(Date.parse(datetime));
  } catch (_error) {
    result = datetime;
  }
  return result;
}
