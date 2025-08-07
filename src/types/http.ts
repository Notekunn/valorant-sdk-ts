// HTTP Client Types
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  ksize: number;
  vsize: number;
}

export interface CacheConfig {
  ttl?: number;
  checkperiod?: number;
}
