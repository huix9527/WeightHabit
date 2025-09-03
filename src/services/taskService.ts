import { apiService } from './api';
import { Task, DailyTask, TaskSelectionData, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 任务服务
 * 处理任务相关的API调用
 */
class TaskService {
  /**
   * 获取每日任务
   */
  async getDailyTasks(date?: string): Promise<ApiResponse<TaskSelectionData>> {
    const params = date ? { date } : {};
    const response = await apiService.get('/tasks/daily', { params });
    return response.data;
  }

  /**
   * 选择任务
   */
  async selectTasks(taskIds: string[], date?: string): Promise<ApiResponse> {
    const data = { task_ids: taskIds, date };
    const response = await apiService.post('/tasks/select', data);
    return response.data;
  }

  /**
   * 获取任务库
   */
  async getTaskLibrary(params?: {
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const response = await apiService.get('/tasks/library', { params });
    return response.data;
  }

  /**
   * 获取任务详情
   */
  async getTaskDetail(taskId: string): Promise<ApiResponse<Task>> {
    const response = await apiService.get(`/tasks/${taskId}`);
    return response.data;
  }

  /**
   * 获取用户任务历史
   */
  async getTaskHistory(params?: {
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<DailyTask>>> {
    const response = await apiService.get('/tasks/history', { params });
    return response.data;
  }

  /**
   * 获取任务统计
   */
  async getTaskStats(period?: string): Promise<ApiResponse<{
    period: string;
    overall: any;
    by_category: any[];
  }>> {
    const params = period ? { period } : {};
    const response = await apiService.get('/tasks/stats', { params });
    return response.data;
  }
}

// 创建单例实例
export const taskService = new TaskService();

export default taskService;


