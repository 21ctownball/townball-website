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

export function isHrefExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function scrollToElement(el: HTMLElement, { behavior = 'smooth', offset = 0 }: { behavior?: ScrollBehavior; offset?: number } = {}) {
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
