import axios from 'axios';

import { DEFAULT_CONFIG, DefaultHeader } from './constants';

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpClientConfig {
  timeout?: number;
  retries?: number;
  baseURL?: string;
  headers?: Record<string, string>;
}

export class HttpClient {
  private client: AxiosInstance;
  private retries: number;

  constructor(config: HttpClientConfig = {}) {
    this.retries = config.retries ?? DEFAULT_CONFIG.retries;

    this.client = axios.create({
      timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
      ...(config.baseURL && { baseURL: config.baseURL }),
      headers: {
        ...DefaultHeader,
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    if (this.retries > 0) {
      this.retries = 0;
    }
    this.client.interceptors.request.use(
      config => {
        // Add timestamp for debugging
        // (config as any).metadata = { startTime: new Date() };
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // TODO: handle maintenances json.httpStatus === 403 && json.errorCode === 'SCHEDULED_DOWNTIME'
    // TODO: handle 401

    // Response interceptor
    // this.client.interceptors.response.use(
    // 	response => {
    // 		return response;
    // 	},
    // 	async error => {
    // 		const config = error.config;

    // 		// Retry logic for network errors or 5xx responses
    // 		if (
    // 			config &&
    // 			!config.__isRetryRequest &&
    // 			this.retries > 0 &&
    // 			(error.code === 'ECONNABORTED' ||
    // 				error.code === 'ENOTFOUND' ||
    // 				error.code === 'ECONNRESET' ||
    // 				(error.response && error.response.status >= 500))
    // 		) {
    // 			config.__isRetryRequest = true;
    // 			config.retryCount = (config.retryCount || 0) + 1;

    // 			if (config.retryCount <= this.retries) {
    // 				// Exponential backoff
    // 				const delay = Math.pow(2, config.retryCount) * 1000;
    // 				await new Promise(resolve => setTimeout(resolve, delay));

    // 				return this.client(config);
    // 			}
    // 		}

    // 		return Promise.reject(error);
    // 	}
    // );
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request(config);
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    // if (axios.isAxiosError(error)) {
    // 	const status = error.response?.status;
    // 	const message = error.response?.data?.message || error.message;

    // 	switch (status) {
    // 		case 400:
    // 			return new Error(`Bad Request: ${message}`);
    // 		case 401:
    // 			return new Error(`Unauthorized: ${message}`);
    // 		case 403:
    // 			return new Error(`Forbidden: ${message}`);
    // 		case 404:
    // 			return new Error(`Not Found: ${message}`);
    // 		case 429:
    // 			return new Error(`Rate Limited: ${message}`);
    // 		case 500:
    // 			return new Error(`Internal Server Error: ${message}`);
    // 		case 502:
    // 			return new Error(`Bad Gateway: ${message}`);
    // 		case 503:
    // 			return new Error(`Service Unavailable: ${message}`);
    // 		case 504:
    // 			return new Error(`Gateway Timeout: ${message}`);
    // 		default:
    // 			if (error.code === 'ECONNABORTED') {
    // 				return new Error('Request timeout');
    // 			}
    // 			if (error.code === 'ENOTFOUND') {
    // 				return new Error('Network error: Unable to reach server');
    // 			}
    // 			return new Error(`HTTP Error ${status}: ${message}`);
    // 	}
    // }

    return error;
  }

  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  setHeaders(headers: Record<string, string>): void {
    this.client.defaults.headers.common = {
      ...this.client.defaults.headers.common,
      ...headers,
    };
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setUserAgent(userAgent: string): void {
    this.client.defaults.headers.common['User-Agent'] = userAgent;
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}
