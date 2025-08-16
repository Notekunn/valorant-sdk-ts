import { generateCookieString, parseCookies } from '../utils/cookie-parser';
import { ApiBaseUrl, ErrorMessage, RiotEndpoint } from '../utils/enum';
import { HttpClient } from '../utils/http-client';
import { parseAccessToken } from '../utils/token-parser';

import type {
  RiotAuthResponse,
  RiotAuthCookies,
  RiotAuthConfig,
  RiotReAuthResponse,
  RiotUserInfo,
} from '../types';

export class AuthAPI {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseURL: ApiBaseUrl.RiotAuth,
    });
  }

  /**
   * Authenticate with Riot Games using username and password
   */
  async authenticate(config: RiotAuthConfig): Promise<RiotReAuthResponse> {
    try {
      console.log('Authenticating with Riot Games...');
      console.log('Start fetching cookies...');
      console.log('--------------------------------');
      // Step 1: Get cookies
      // const cookies = await this.fetchCookies();
      const cookies: RiotAuthCookies = [];
      console.log('Cookies fetched successfully');
      console.log('Start authenticating with credentials...');
      console.log('--------------------------------');

      // Step 2: Authenticate with credentials
      const authResponse = await this.login(config.username, config.password, cookies);
      console.log('Authentication successful');
      console.log('--------------------------------');

      // Step 3: Handle multifactor if required
      if (authResponse.type === 'multifactor') {
        throw new Error(ErrorMessage.MultifactorRequired);
      }

      // Step 4: Get entitlements token
      const entitlementsToken = await this.fetchEntitlementsToken(authResponse['session-cookie']);

      return {
        accessToken: authResponse['session-cookie'],
        idToken: '',
        entitlementsToken,
        cookies,
      };
    } catch (error) {
      throw new Error(
        `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  /**
   * Re-authenticate with Riot Games using existing cookies
   * @param cookies - The cookies to use for authentication
   * @returns The re-authenticated response
   */
  async reAuthenticate(cookies: string): Promise<RiotReAuthResponse> {
    try {
      const response = await this.httpClient.request({
        method: 'GET',
        url: RiotEndpoint.AuthCookies,
        headers: {
          Cookie: cookies,
        },
        params: {
          client_id: 'play-valorant-web-prod',
          nonce: '1',
          redirect_uri: 'https://playvalorant.com/opt_in',
          response_type: 'token id_token',
          scope: 'account openid',
        },
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 400,
      });

      const redirectUrl = response.headers['location'];

      const { accessToken, idToken, expireAt } = parseAccessToken(redirectUrl);
      if (!accessToken) {
        throw new Error('Failed to extract access token from cookies');
      }

      if (!idToken) {
        throw new Error('Failed to extract id token from cookies');
      }

      if (!expireAt) {
        throw new Error('Failed to extract expire at from cookies');
      }

      // Step 3: Get entitlements token
      const entitlementsToken = await this.fetchEntitlementsToken(accessToken);

      return {
        accessToken,
        idToken,
        entitlementsToken,
        cookies: parseCookies(cookies),
        expireAt,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async refreshToken(auth: RiotReAuthResponse): Promise<RiotReAuthResponse> {
    try {
      if (auth.expireAt && new Date(auth.expireAt).getTime() > new Date().getTime()) {
        console.log('Token is still valid, only refresh entitlements token');
        const entitlementsToken = await this.fetchEntitlementsToken(auth.accessToken);

        return {
          ...auth,
          entitlementsToken,
        };
      }

      if (Array.isArray(auth.cookies) && auth.cookies.length > 0) {
        console.log('Token is expired, re-authenticate with cookies');
        const cookies = generateCookieString(auth.cookies);
        const reAuth = await this.reAuthenticate(cookies);

        return {
          ...reAuth,
          entitlementsToken: reAuth.entitlementsToken,
        };
      }

      return auth;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Login with username and password
   */
  private async login(
    username: string,
    password: string,
    cookies: RiotAuthCookies
  ): Promise<RiotAuthResponse> {
    const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');

    const response = await this.httpClient.post<RiotAuthResponse>(
      RiotEndpoint.AuthCookies,
      {
        password,
        remember: true,
        type: 'auth',
        username,
      },
      {
        headers: {
          Cookie: cookieString,
        },
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Get entitlements token for Valorant API access
   */
  private async fetchEntitlementsToken(accessToken: string): Promise<string> {
    const entitlementsClient = new HttpClient({
      baseURL: ApiBaseUrl.RiotEntitlements,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await entitlementsClient.post<{ entitlements_token: string }>(
      RiotEndpoint.Entitlements,
      {
        client_id: 'play-valorant-web-prod',
        client_secret: 'RiotClientSecret',
        grant_type: 'client_credentials',
      }
    );

    return response.entitlements_token;
  }

  /**
   * Handle multifactor authentication
   */
  async handleMultifactor(cookies: RiotAuthCookies, code: string): Promise<RiotReAuthResponse> {
    if (!cookies) {
      throw new Error('No active session found. Please authenticate first.');
    }

    const cookieString = generateCookieString(cookies);

    const response = await this.httpClient.put<RiotAuthResponse>(
      RiotEndpoint.AuthMultifactor,
      {
        type: 'multifactor',
        code,
        rememberDevice: true,
      },
      {
        headers: {
          Cookie: cookieString,
        },
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    // Get entitlements token
    const entitlementsToken = await this.fetchEntitlementsToken(response['session-cookie']);

    return {
      accessToken: response['session-cookie'],
      idToken: '',
      entitlementsToken,
      cookies,
    };
  }

  async getUserInfo(auth: RiotReAuthResponse): Promise<RiotUserInfo> {
    try {
      const data = await this.httpClient.get(RiotEndpoint.UserInfo, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      const tagName = data?.acct?.game_name ? `${data.acct.game_name}#${data.acct.tag_line}` : '';

      return {
        country: data?.country ?? '',
        puuid: data?.sub ?? '',
        username: data?.preferred_username,
        tagName,
      };
    } catch (error) {
      throw new Error(
        `Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(auth: RiotReAuthResponse): boolean {
    return !!(
      auth.accessToken &&
      auth.entitlementsToken &&
      auth.expireAt &&
      new Date(auth.expireAt).getTime() > new Date().getTime()
    );
  }
}
