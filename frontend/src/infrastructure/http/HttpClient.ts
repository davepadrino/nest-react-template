import axios, { AxiosInstance, AxiosError } from 'axios';
import { Logger } from '../logging/Logger';
import { NetworkException } from '@domain/exceptions/DomainException';

/**
 *
 * Axios wrapper with error handling and logging
 */
export class HttpClient {
  private client: AxiosInstance;
  private logger: Logger;

  constructor(baseURL: string) {
    this.logger = new Logger('HttpClient');
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request error', error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      this.logger.error(`HTTP Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      this.logger.error('Network Error: No response received', error.message);
      throw new NetworkException('Network error occurred. Please check your connection.');
    } else {
      this.logger.error('Request Error', error.message);
    }
  }

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}
