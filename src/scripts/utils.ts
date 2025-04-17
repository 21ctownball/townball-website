const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export function getFormattedDatetime(datetime: string) {
  let result: string;
  const formatter = new Intl.DateTimeFormat(undefined, options);
  try {
    result = formatter.format(Date.parse(datetime));
  } catch (_error) {
    result = datetime;
  }
  return result;
}

getFormattedDatetime['options'] = options;

export function isHrefExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function scrollToElement(el: HTMLElement, { behavior = 'smooth', offset = 0 }: { behavior?: ScrollBehavior; offset?: number } = {}) {
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
