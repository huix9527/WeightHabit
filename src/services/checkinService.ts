import { apiService } from './api';
import { CheckIn, CheckInStats, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 打卡服务
 * 处理打卡相关的API调用
 */
class CheckinService {
  /**
   * 完成任务打卡
   */
  async completeTask(data: {
    task_id: string;
    note?: string;
    photo_url?: string;
  }): Promise<ApiResponse<{
    points_earned: number;
    completed_count: number;
    selected_count: number;
    all_completed: boolean;
  }>> {
    const response = await apiService.post('/checkin/complete', data);
    return response.data;
  }

  /**
   * 取消任务完成
   */
  async uncompleteTask(taskId: string): Promise<ApiResponse> {
    const response = await apiService.post('/checkin/uncomplete', { task_id: taskId });
    return response.data;
  }

  /**
   * 获取打卡记录
   */
  async getCheckinRecords(params?: {
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<CheckIn>>> {
    const response = await apiService.get('/checkin/records', { params });
    return response.data;
  }

  /**
   * 获取打卡统计
   */
  async getCheckinStats(): Promise<ApiResponse<CheckInStats>> {
    const response = await apiService.get('/checkin/stats');
    return response.data;
  }

  /**
   * 获取连续打卡信息
   */
  async getStreakInfo(): Promise<ApiResponse<{
    current_streak: number;
    max_streak: number;
    streak_start_date?: string;
    streak_end_date?: string;
    this_week: any[];
  }>> {
    const response = await apiService.get('/checkin/streak');
    return response.data;
  }

  /**
   * 补签打卡
   */
  async makeupCheckin(date: string): Promise<ApiResponse<{
    remaining_makeup: number;
  }>> {
    const response = await apiService.post('/checkin/makeup', { date });
    return response.data;
  }
}

// 创建单例实例
export const checkinService = new CheckinService();

export default checkinService;


