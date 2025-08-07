// Riot Authentication Types
export interface RiotAuthResponse {
  type: string;
  error: string;
  country: string;
  'client-platform': string;
  'client-version': string;
  'session-cookie': string;
  multifactor: {
    email: string;
    method: string;
    methods: Array<{
      email: string;
      method: string;
    }>;
    multiFactorCodeLength: number;
    mfaVersion: string;
  };
  'security-profile': string;
}

export interface RiotAuthCookie {
  name: string;
  value: string;
}

export type RiotAuthCookies = RiotAuthCookie[];

export interface RiotReAuthResponse {
  accessToken: string;
  idToken: string;
  entitlementsToken: string;
  cookies?: RiotAuthCookies;
}

export interface RiotUserInfo {
  country: string;
  puuid: string;
  username: string;
  tagName: string;
}

export interface RiotAuthConfig {
  username: string;
  password: string;
  rememberMe?: boolean;
  region: string;
}

export interface RiotAuthToken {
  accessToken?: string;
  idToken?: string;
  expiresAt?: Date;
}
