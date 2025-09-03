import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CheckIn, CheckInState, CheckInStats } from '@/types';
import { checkinService } from '@/services/checkinService';

// 初始状态
const initialState: CheckInState = {
  records: [],
  stats: null,
  isLoading: false,
  error: null,
};

// 异步actions

// 完成任务
export const completeTask = createAsyncThunk(
  'checkin/completeTask',
  async (data: { task_id: string; note?: string; photo_url?: string }) => {
    const response = await checkinService.completeTask(data);
    return response.data;
  }
);

// 取消任务完成
export const uncompleteTask = createAsyncThunk(
  'checkin/uncompleteTask',
  async (taskId: string) => {
    const response = await checkinService.uncompleteTask(taskId);
    return { taskId };
  }
);

// 获取打卡记录
export const fetchCheckinRecords = createAsyncThunk(
  'checkin/fetchCheckinRecords',
  async (params?: { start_date?: string; end_date?: string; page?: number }) => {
    const response = await checkinService.getCheckinRecords(params);
    return response.data;
  }
);

// 获取打卡统计
export const fetchCheckinStats = createAsyncThunk(
  'checkin/fetchCheckinStats',
  async () => {
    const response = await checkinService.getCheckinStats();
    return response.data;
  }
);

// 获取连续打卡信息
export const fetchStreakInfo = createAsyncThunk(
  'checkin/fetchStreakInfo',
  async () => {
    const response = await checkinService.getStreakInfo();
    return response.data;
  }
);

// 补签打卡
export const makeupCheckin = createAsyncThunk(
  'checkin/makeupCheckin',
  async (date: string) => {
    const response = await checkinService.makeupCheckin(date);
    return response.data;
  }
);

// 创建slice
const checkinSlice = createSlice({
  name: 'checkin',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 重置打卡状态
    resetCheckin: (state) => {
      state.records = [];
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 完成任务
    builder
      .addCase(completeTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // 可以在这里更新统计信息
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '完成任务失败';
      });

    // 取消任务完成
    builder
      .addCase(uncompleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uncompleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(uncompleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '取消任务失败';
      });

    // 获取打卡记录
    builder
      .addCase(fetchCheckinRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCheckinRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCheckinRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取打卡记录失败';
      });

    // 获取打卡统计
    builder
      .addCase(fetchCheckinStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCheckinStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchCheckinStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取打卡统计失败';
      });

    // 获取连续打卡信息
    builder
      .addCase(fetchStreakInfo.fulfilled, (state, action) => {
        // 更新统计信息中的连续打卡数据
        if (state.stats) {
          state.stats.current_streak = action.payload.current_streak;
          state.stats.max_streak = action.payload.max_streak;
        }
      });

    // 补签打卡
    builder
      .addCase(makeupCheckin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(makeupCheckin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(makeupCheckin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '补签失败';
      });
  },
});

// 导出actions
export const { 
  clearError, 
  resetCheckin 
} = checkinSlice.actions;

// 导出selectors
export const selectCheckin = (state: { checkin: CheckInState }) => state.checkin;
export const selectCheckinRecords = (state: { checkin: CheckInState }) => state.checkin.records;
export const selectCheckinStats = (state: { checkin: CheckInState }) => state.checkin.stats;
export const selectCheckinLoading = (state: { checkin: CheckInState }) => state.checkin.isLoading;
export const selectCheckinError = (state: { checkin: CheckInState }) => state.checkin.error;

export default checkinSlice.reducer;


