const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export function getFormattedDatetime(datetime: string) {
  const formatter = new Intl.DateTimeFormat(undefined, options);
  return formatter.format(Date.parse(datetime));
}

getFormattedDatetime['options'] = options;

export function isHrefExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function scrollToElement(el: HTMLElement, { behavior = 'smooth', offset = 0 }: { behavior?: ScrollBehavior; offset?: number } = {}) {
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
