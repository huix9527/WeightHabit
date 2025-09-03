import { API_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from "@/constants";
import { ApiResponse } from "@/types";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { storageService } from "./storageService";

class ApiService {
  private instance: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
    this.loadAuthToken();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config) => {
        // 添加认证token
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // 添加请求ID用于追踪
        config.headers["X-Request-ID"] = this.generateRequestId();

        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );

        return config;
      },
      (error) => {
        console.error("❌ API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log(
          `✅ API Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      async (error) => {
        console.error("❌ API Response Error:", error);

        if (error.response) {
          const { status } = error.response;

          // 处理认证失败
          if (status === 401) {
            await this.handleAuthError();
            return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
          }

          // 处理其他HTTP错误
          const errorMessage = this.getErrorMessage(status);
          return Promise.reject(new Error(errorMessage));
        }

        // 处理网络错误
        if (error.code === "ECONNABORTED") {
          return Promise.reject(new Error(ERROR_MESSAGES.TIMEOUT));
        }

        if (!error.response) {
          return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
        }

        return Promise.reject(new Error(ERROR_MESSAGES.UNKNOWN_ERROR));
      }
    );
  }

  private async loadAuthToken(): Promise<void> {
    try {
      this.authToken = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.warn("Failed to load auth token:", error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 429:
        return "请求过于频繁，请稍后重试";
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  private async handleAuthError(): Promise<void> {
    // 清除认证信息
    this.authToken = null;
    await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storageService.removeItem(STORAGE_KEYS.USER_DATA);

    // 可以在这里触发重新登录的逻辑
    // 例如：导航到登录页面、显示登录模态框等
  }

  // 设置认证token
  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  // 清除认证token
  public clearAuthToken(): void {
    this.authToken = null;
  }

  // GET请求
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(url, config);
  }

  // POST请求
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(url, data, config);
  }

  // PUT请求
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(url, data, config);
  }

  // PATCH请求
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch(url, data, config);
  }

  // DELETE请求
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(url, config);
  }

  // 带重试的请求
  public async requestWithRetry<T = any>(
    requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
    maxRetries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;

        // 如果是最后一次重试，直接抛出错误
        if (i === maxRetries) {
          break;
        }

        // 如果是认证错误或客户端错误，不重试
        if (
          error.message === ERROR_MESSAGES.UNAUTHORIZED ||
          error.message === ERROR_MESSAGES.VALIDATION_ERROR
        ) {
          break;
        }

        // 等待一段时间后重试
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }

    throw lastError!;
  }

  // 上传文件
  public async uploadFile(
    url: string,
    file: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<ApiResponse<{ url: string }>>> {
    return this.instance.post(url, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  // 下载文件
  public async downloadFile(
    url: string,
    filename?: string
  ): Promise<AxiosResponse<Blob>> {
    const response = await this.instance.get(url, {
      responseType: "blob",
    });

    // 如果提供了文件名，创建下载链接
    if (filename) {
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }

    return response;
  }

  // 批量请求
  public async batchRequest<T = any>(
    requests: (() => Promise<AxiosResponse<ApiResponse<T>>>)[]
  ): Promise<AxiosResponse<ApiResponse<T>>[]> {
    return Promise.all(requests.map((request) => request()));
  }

  // 获取请求实例（用于自定义配置）
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建单例实例
export const apiService = new ApiService();

// 导出类型
export type ApiServiceType = typeof apiService;

export default apiService;
