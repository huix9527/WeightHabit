import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '@/types';

// UI状态接口
interface UIState {
  // 主题设置
  theme: 'light' | 'dark' | 'system';
  
  // 网络状态
  isOnline: boolean;
  
  // 加载状态
  globalLoading: boolean;
  
  // 模态框状态
  modals: {
    taskSelection: boolean;
    weightRecord: boolean;
    profile: boolean;
    settings: boolean;
  };
  
  // 底部弹窗状态
  bottomSheets: {
    taskDetail: boolean;
    checkinSuccess: boolean;
    achievementUnlocked: boolean;
  };
  
  // 吐司消息
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  } | null;
  
  // 应用设置
  settings: AppSettings;
  
  // 键盘状态
  keyboardHeight: number;
  
  // 引导状态
  onboarding: {
    completed: boolean;
    currentStep: number;
  };
  
  // 刷新状态
  refreshing: {
    home: boolean;
    tasks: boolean;
    social: boolean;
    profile: boolean;
  };
}

// 初始状态
const initialState: UIState = {
  theme: 'system',
  isOnline: true,
  globalLoading: false,
  modals: {
    taskSelection: false,
    weightRecord: false,
    profile: false,
    settings: false,
  },
  bottomSheets: {
    taskDetail: false,
    checkinSuccess: false,
    achievementUnlocked: false,
  },
  toast: null,
  settings: {
    notifications: {
      push: true,
      email: false,
      daily_reminder: true,
      friend_activity: true,
      achievements: true,
    },
    privacy: {
      profile_visibility: 'friends',
      activity_visibility: 'friends',
    },
    theme: {
      mode: 'system',
      primary_color: '#6366f1',
    },
    language: 'zh-CN',
  },
  keyboardHeight: 0,
  onboarding: {
    completed: false,
    currentStep: 0,
  },
  refreshing: {
    home: false,
    tasks: false,
    social: false,
    profile: false,
  },
};

// 创建slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 设置主题
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      state.settings.theme.mode = action.payload;
    },
    
    // 设置网络状态
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    
    // 设置全局加载状态
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    
    // 显示/隐藏模态框
    showModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    
    hideModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    
    // 显示/隐藏底部弹窗
    showBottomSheet: (state, action: PayloadAction<keyof UIState['bottomSheets']>) => {
      state.bottomSheets[action.payload] = true;
    },
    
    hideBottomSheet: (state, action: PayloadAction<keyof UIState['bottomSheets']>) => {
      state.bottomSheets[action.payload] = false;
    },
    
    // 显示吐司消息
    showToast: (state, action: PayloadAction<{
      message: string;
      type?: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
    }>) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
      };
    },
    
    // 隐藏吐司消息
    hideToast: (state) => {
      state.toast = null;
    },
    
    // 更新应用设置
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    // 设置键盘高度
    setKeyboardHeight: (state, action: PayloadAction<number>) => {
      state.keyboardHeight = action.payload;
    },
    
    // 完成引导
    completeOnboarding: (state) => {
      state.onboarding.completed = true;
    },
    
    // 设置引导步骤
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.onboarding.currentStep = action.payload;
    },
    
    // 设置刷新状态
    setRefreshing: (state, action: PayloadAction<{
      screen: keyof UIState['refreshing'];
      refreshing: boolean;
    }>) => {
      state.refreshing[action.payload.screen] = action.payload.refreshing;
    },
    
    // 重置UI状态
    resetUI: (state) => {
      state.modals = initialState.modals;
      state.bottomSheets = initialState.bottomSheets;
      state.toast = null;
      state.globalLoading = false;
      state.refreshing = initialState.refreshing;
    },
  },
});

// 导出actions
export const {
  setTheme,
  setOnlineStatus,
  setGlobalLoading,
  showModal,
  hideModal,
  showBottomSheet,
  hideBottomSheet,
  showToast,
  hideToast,
  updateSettings,
  setKeyboardHeight,
  completeOnboarding,
  setOnboardingStep,
  setRefreshing,
  resetUI,
} = uiSlice.actions;

// 导出selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectOnlineStatus = (state: { ui: UIState }) => state.ui.isOnline;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectBottomSheets = (state: { ui: UIState }) => state.ui.bottomSheets;
export const selectToast = (state: { ui: UIState }) => state.ui.toast;
export const selectSettings = (state: { ui: UIState }) => state.ui.settings;
export const selectKeyboardHeight = (state: { ui: UIState }) => state.ui.keyboardHeight;
export const selectOnboarding = (state: { ui: UIState }) => state.ui.onboarding;
export const selectRefreshing = (state: { ui: UIState }) => state.ui.refreshing;

export default uiSlice.reducer;


