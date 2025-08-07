import type { RiotAuthToken } from '../types';

/**
 * Parse access token from redirect url
 * @param redirectUrl - The redirect url
 * @returns The access token
 */
export const parseAccessToken = (redirectUrl: string): RiotAuthToken => {
  if (!redirectUrl) return {};
  try {
    const [, hash] = redirectUrl.split('#');
    if (!hash) return {};

    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token') || '';
    const idToken = params.get('id_token') || '';
    const expiresIn = +(params.get('expires_in') || 0);

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return { accessToken, idToken, expiresAt };
  } catch (error) {
    console.log(error);
    return {};
  }
};
