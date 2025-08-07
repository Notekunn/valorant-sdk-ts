import type { RiotAuthCookie, RiotAuthCookies } from '../types';

export const generateCookieString = (cookies: RiotAuthCookies): string => {
  return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
};

const parseCookie = (cookie: string): RiotAuthCookie | null => {
  const [name, ...value] = cookie.split('=');
  if (!name) return null;
  return { name, value: value.join('=') };
};

export const parseCookies = (cookieString: string): RiotAuthCookies => {
  return cookieString.split('; ').map(parseCookie).filter(Boolean) as RiotAuthCookies;
};
