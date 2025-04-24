const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export function convertDateStringToIso(date: string) {
  const result = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result)) throw new Error(`Invalid datetime: ${date}`);
  return result;
}

export function getFormattedDatetime(datetime: string) {
  const formatter = new Intl.DateTimeFormat(undefined, options);
  let input: string;
  if (/^\d{8}$/.test(datetime)) input = convertDateStringToIso(datetime);
  else input = datetime;
  return formatter.format(Date.parse(input));
}

getFormattedDatetime['options'] = options;

export function isHrefExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function scrollToElement(el: HTMLElement, { behavior = 'smooth', offset = 0 }: { behavior?: ScrollBehavior; offset?: number } = {}) {
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
