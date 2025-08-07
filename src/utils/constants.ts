export const DEFAULT_CONFIG = {
  timeout: 10000,
  retries: 3,
  cacheTTL: 300, // 5 minutes
  userAgent: 'RiotClient/58.0.0.6400294126 (Windows; 10; Professional (Build 19041))',
} as const;

// HTTP Headers
export const DEFAULT_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  AcceptLanguage: 'en-US,en;q=0.9',
  ContentType: 'application/json',
  UserAgent: 'RiotClient/58.0.0.6400294126 (Windows; 10; Professional (Build 19041))',
};
