import { isHrefExternal } from './utils';

type Link = {
  href: string;
  title: string;
  target?: string;
  logo?: any;
};

export const NAV_LINKS: Link[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Rules',
    href: '/rules',
  },
  {
    title: 'History',
    href: '/history',
  },
  {
    title: 'Media',
    href: '/media',
  },
  {
    title: 'Shop',
    href: 'https://thetownballzone.square.site',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
].map((link) => ({
  ...link,
  target: isHrefExternal(link.href) ? '_blank' : undefined,
}));
