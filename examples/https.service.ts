import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiUrl } from "../constants";

export const httpClient = axios.create();

class HTTPService {
  static AUTH_HEADER_KEY = "Authorization";
  private static refreshInProgress = false;
  _instanse: AxiosInstance;
  constructor() {
    this._instanse = axios.create({
      baseURL: ApiUrl.base,
      timeout: 10000,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      withCredentials: true,
    });
    this._instanse.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }
  private static timeout = async (finalize: any): Promise<void> => {
    setTimeout(() => {
      if (HTTPService.refreshInProgress) {
        HTTPService.timeout(finalize);
      } else {
        finalize();
      }
    }, 100);
  };

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this._instanse.post(url, data, config);
  }

  handleSuccess = (response: AxiosResponse): AxiosResponse => {
    return response;
  };
  handleError = async (error: any): Promise<any> => {
    // Example of handling
    const originalRequest = error.config;
    if (
      error.response.data.code === 401004 ||
      error.response.data.code === 401005
    ) {
      originalRequest._retry = true;
      // Make some repeated request here
      return this._instanse(originalRequest);
    } else {
      throw error;
    }
  };
  get(url: string, params = {}) {
    return this._instanse.get(url, params);
  }
  patch(url: string, data?: any, headers?: any) {
    return this._instanse.patch(url, JSON.stringify(data), { headers });
  }

  put(url: string, data?: any) {
    return this._instanse.put(url, JSON.stringify(data));
  }

  delete(url: string, params?: any) {
    return this._instanse.delete(url, params);
  }

  setAuthHeader(token: string) {
    this._instanse.defaults.headers.common[
      HTTPService.AUTH_HEADER_KEY
    ] = `Bearer ${token}`;
  }

  removeAuthHeader() {
    this._instanse.defaults.headers.common[HTTPService.AUTH_HEADER_KEY] = "";
  }
}

export const httpService = new HTTPService();
