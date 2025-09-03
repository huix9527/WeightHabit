import { apiService } from './api';
import { Friend, LeaderboardEntry, Post, Comment, User, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 社交服务
 * 处理社交功能相关的API调用
 */
class SocialService {
  /**
   * 搜索用户
   */
  async searchUsers(keyword: string): Promise<ApiResponse<User[]>> {
    const response = await apiService.get('/social/search', { params: { q: keyword } });
    return response.data;
  }

  /**
   * 发送好友请求
   */
  async sendFriendRequest(userId: string): Promise<ApiResponse> {
    const response = await apiService.post('/social/friends/request', { user_id: userId });
    return response.data;
  }

  /**
   * 获取好友列表
   */
  async getFriends(): Promise<ApiResponse<Friend[]>> {
    const response = await apiService.get('/social/friends');
    return response.data;
  }

  /**
   * 处理好友请求
   */
  async handleFriendRequest(friendshipId: string, action: 'accept' | 'reject'): Promise<ApiResponse> {
    const response = await apiService.put(`/social/friends/${friendshipId}`, { action });
    return response.data;
  }

  /**
   * 删除好友
   */
  async removeFriend(friendId: string): Promise<ApiResponse> {
    const response = await apiService.delete(`/social/friends/${friendId}`);
    return response.data;
  }

  /**
   * 获取排行榜
   */
  async getLeaderboard(params?: {
    type?: string;
    friends_only?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<LeaderboardEntry>>> {
    const response = await apiService.get('/leaderboard', { params });
    return response.data;
  }

  /**
   * 获取我的排名
   */
  async getMyRank(type?: string): Promise<ApiResponse<{ rank: number; points: number }>> {
    const params = type ? { type } : {};
    const response = await apiService.get('/leaderboard/my-rank', { params });
    return response.data;
  }

  /**
   * 获取动态列表
   */
  async getPosts(params?: {
    type?: string;
    user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiService.get('/posts', { params });
    return response.data;
  }

  /**
   * 发布动态
   */
  async createPost(data: {
    content: string;
    images?: string[];
    post_type?: string;
    is_public?: boolean;
  }): Promise<ApiResponse<Post>> {
    const response = await apiService.post('/posts', data);
    return response.data;
  }

  /**
   * 获取动态详情
   */
  async getPostDetail(postId: string): Promise<ApiResponse<Post>> {
    const response = await apiService.get(`/posts/${postId}`);
    return response.data;
  }

  /**
   * 点赞动态
   */
  async likePost(postId: string): Promise<ApiResponse> {
    const response = await apiService.post(`/posts/${postId}/like`);
    return response.data;
  }

  /**
   * 评论动态
   */
  async commentPost(postId: string, content: string, parentId?: string): Promise<ApiResponse<Comment>> {
    const data = { content, parent_id: parentId };
    const response = await apiService.post(`/posts/${postId}/comments`, data);
    return response.data;
  }

  /**
   * 获取动态评论
   */
  async getPostComments(postId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    const response = await apiService.get(`/posts/${postId}/comments`, { params });
    return response.data;
  }
}

// 创建单例实例
export const socialService = new SocialService();

export default socialService;


