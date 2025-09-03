import { apiService } from './api';
import { User, ApiResponse } from '@/types';

/**
 * 认证服务
 * 处理用户认证相关的API调用
 */
class AuthService {
  /**
   * 用户登录
   */
  async login(credentials: {
    phone?: string;
    email?: string;
    password?: string;
    verification_code?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post('/auth/login', credentials);
    return response.data;
  }

  /**
   * 用户注册
   */
  async register(userData: {
    phone?: string;
    email?: string;
    nickname: string;
    password?: string;
    gender?: string;
    age?: number;
    current_weight?: number;
    target_weight?: number;
    target_date?: string;
    exercise_level?: string;
    dietary_preferences?: string[];
    sleep_time?: string;
    wake_time?: string;
    wechat_openid?: string;
    apple_user_id?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post('/auth/register', userData);
    return response.data;
  }

  /**
   * 发送验证码
   */
  async sendVerificationCode(phone: string): Promise<ApiResponse<{ code?: string }>> {
    const response = await apiService.post('/auth/send-verification', { phone });
    return response.data;
  }

  /**
   * 验证码登录
   */
  async loginWithCode(data: {
    phone: string;
    verification_code: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post('/auth/login-with-code', data);
    return response.data;
  }

  /**
   * 微信登录
   */
  async loginWithWechat(wechatCode: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post('/auth/wechat-login', { wechat_code: wechatCode });
    return response.data;
  }

  /**
   * Apple登录
   */
  async loginWithApple(identityToken: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post('/auth/apple-login', { apple_identity_token: identityToken });
    return response.data;
  }

  /**
   * 刷新令牌
   */
  async refreshToken(): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post('/auth/refresh');
    return response.data;
  }

  /**
   * 退出登录
   */
  async logout(): Promise<ApiResponse> {
    const response = await apiService.post('/auth/logout');
    return response.data;
  }

  /**
   * 重置密码
   */
  async resetPassword(data: {
    phone: string;
    verification_code: string;
    new_password: string;
  }): Promise<ApiResponse> {
    const response = await apiService.post('/auth/reset-password', data);
    return response.data;
  }

  /**
   * 验证令牌
   */
  async verifyToken(): Promise<ApiResponse<{ user: User; valid: boolean }>> {
    const response = await apiService.post('/auth/verify-token');
    return response.data;
  }

  /**
   * 设置认证token
   */
  setAuthToken(token: string): void {
    apiService.setAuthToken(token);
  }

  /**
   * 清除认证token
   */
  clearAuthToken(): void {
    apiService.clearAuthToken();
  }
}

// 创建单例实例
export const authService = new AuthService();

export default authService;


