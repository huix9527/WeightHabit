import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, DailyTask, TaskState, TaskSelectionData } from '@/types';
import { taskService } from '@/services/taskService';

// 初始状态
const initialState: TaskState = {
  dailyTasks: [],
  taskLibrary: [],
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  error: null,
};

// 异步actions

// 获取每日任务
export const fetchDailyTasks = createAsyncThunk(
  'tasks/fetchDailyTasks',
  async (date?: string) => {
    const response = await taskService.getDailyTasks(date);
    return response.data;
  }
);

// 选择任务
export const selectTasks = createAsyncThunk(
  'tasks/selectTasks',
  async (taskIds: string[]) => {
    const response = await taskService.selectTasks(taskIds);
    return { taskIds };
  }
);

// 获取任务库
export const fetchTaskLibrary = createAsyncThunk(
  'tasks/fetchTaskLibrary',
  async (params?: { category?: string; difficulty?: string; page?: number }) => {
    const response = await taskService.getTaskLibrary(params);
    return response.data;
  }
);

// 获取任务详情
export const fetchTaskDetail = createAsyncThunk(
  'tasks/fetchTaskDetail',
  async (taskId: string) => {
    const response = await taskService.getTaskDetail(taskId);
    return response.data;
  }
);

// 创建slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置选中日期
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    
    // 本地更新任务状态（用于乐观更新）
    updateTaskLocally: (state, action: PayloadAction<{ taskId: string; updates: Partial<DailyTask> }>) => {
      const { taskId, updates } = action.payload;
      const taskIndex = state.dailyTasks.findIndex(task => task.task_id === taskId);
      if (taskIndex !== -1) {
        state.dailyTasks[taskIndex] = { ...state.dailyTasks[taskIndex], ...updates };
      }
    },
    
    // 重置任务状态
    resetTasks: (state) => {
      state.dailyTasks = [];
      state.taskLibrary = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取每日任务
    builder
      .addCase(fetchDailyTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyTasks = action.payload.tasks;
        state.error = null;
      })
      .addCase(fetchDailyTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取每日任务失败';
      });

    // 选择任务
    builder
      .addCase(selectTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        // 更新任务选择状态
        state.dailyTasks.forEach(task => {
          task.is_selected = action.payload.taskIds.includes(task.task_id);
        });
        state.error = null;
      })
      .addCase(selectTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '选择任务失败';
      });

    // 获取任务库
    builder
      .addCase(fetchTaskLibrary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskLibrary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskLibrary = action.payload.data;
        state.error = null;
      })
      .addCase(fetchTaskLibrary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取任务库失败';
      });

    // 获取任务详情
    builder
      .addCase(fetchTaskDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        // 更新任务库中的任务详情
        const taskIndex = state.taskLibrary.findIndex(task => task.id === action.payload.id);
        if (taskIndex !== -1) {
          state.taskLibrary[taskIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchTaskDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取任务详情失败';
      });
  },
});

// 导出actions
export const { 
  clearError, 
  setSelectedDate, 
  updateTaskLocally, 
  resetTasks 
} = taskSlice.actions;

// 导出selectors
export const selectTasksState = (state: { tasks: TaskState }) => state.tasks;
export const selectDailyTasks = (state: { tasks: TaskState }) => state.tasks.dailyTasks;
export const selectSelectedTasks = (state: { tasks: TaskState }) => 
  state.tasks.dailyTasks.filter(task => task.is_selected);
export const selectCompletedTasks = (state: { tasks: TaskState }) => 
  state.tasks.dailyTasks.filter(task => task.is_completed);
export const selectTaskLibrary = (state: { tasks: TaskState }) => state.tasks.taskLibrary;
export const selectSelectedDate = (state: { tasks: TaskState }) => state.tasks.selectedDate;
export const selectTasksLoading = (state: { tasks: TaskState }) => state.tasks.isLoading;
export const selectTasksError = (state: { tasks: TaskState }) => state.tasks.error;

export default taskSlice.reducer;


