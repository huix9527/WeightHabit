import { Dimensions } from 'react-native';

// 设备尺寸
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// API配置
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.weighthabit.com/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// 颜色主题
export const COLORS = {
  // 主色调
  primary: '#6366f1',
  primaryLight: '#a5b4fc',
  primaryDark: '#4f46e5',
  
  // 辅助色
  secondary: '#f59e0b',
  secondaryLight: '#fbbf24',
  secondaryDark: '#d97706',
  
  // 状态色
  success: '#10b981',
  successLight: '#34d399',
  successDark: '#059669',
  
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  
  info: '#3b82f6',
  infoLight: '#60a5fa',
  infoDark: '#2563eb',
  
  // 中性色
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // 背景色
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  surface: '#ffffff',
  
  // 文本色
  text: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',
  
  // 边框色
  border: '#e5e7eb',
  borderFocus: '#6366f1',
  
  // 透明色
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // 任务类别色
  diet: '#f59e0b',
  exercise: '#10b981',
  lifestyle: '#8b5cf6',
};

// 字体大小
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// 字体粗细
export const FONT_WEIGHTS = {
  thin: '100',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// 间距
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// 边框圆角
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 999,
};

// 阴影
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
};

// 动画时长
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// 应用常量
export const APP_CONSTANTS = {
  MAX_DAILY_TASKS: 10,
  MAX_SELECTED_TASKS: 3,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_PASSWORD_LENGTH: 6,
  MAX_NICKNAME_LENGTH: 50,
  MAX_POST_LENGTH: 2000,
  MAX_COMMENT_LENGTH: 500,
  MAX_WEIGHT: 500,
  MIN_AGE: 12,
  MAX_AGE: 120,
  POINTS_PER_TASK: 10,
  BONUS_POINTS_ALL_TASKS: 20,
  MAX_MONTHLY_MAKEUP: 3,
};

// 任务相关常量
export const TASK_CATEGORIES = {
  diet: '饮食',
  exercise: '运动',
  lifestyle: '生活方式',
};

export const TASK_DIFFICULTIES = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export const TASK_ICONS = {
  // 饮食类
  water: 'water',
  dinner: 'dinner',
  bowl: 'bowl',
  chew: 'chew',
  'no-snack': 'no-snack',
  vegetables: 'vegetables',
  steam: 'steam',
  'no-sugar': 'no-sugar',
  
  // 运动类
  walk: 'walk',
  stairs: 'stairs',
  squat: 'squat',
  plank: 'plank',
  stretch: 'stretch',
  'jump-rope': 'jump-rope',
  standing: 'standing',
  'jumping-jack': 'jumping-jack',
  
  // 生活方式类
  sleep: 'sleep',
  weight: 'weight',
  meditation: 'meditation',
  'no-screen': 'no-screen',
  'water-daily': 'water-daily',
  gratitude: 'gratitude',
  planning: 'planning',
  music: 'music',
  organize: 'organize',
};

// 性别选项
export const GENDER_OPTIONS = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' },
];

// 运动水平选项
export const EXERCISE_LEVELS = [
  { label: '无运动基础', value: 'none' },
  { label: '轻度运动', value: 'light' },
  { label: '中度运动', value: 'medium' },
  { label: '重度运动', value: 'heavy' },
];

// 饮食偏好选项
export const DIETARY_PREFERENCES = [
  '素食主义',
  '地中海饮食',
  '低碳水化合物',
  '高蛋白',
  '无麸质',
  '低盐',
  '低糖',
  '有机食品',
  '间歇性禁食',
  '生酮饮食',
];

// 通知类型
export const NOTIFICATION_TYPES = {
  TASK_REMINDER: 'task_reminder',
  FRIEND_REQUEST: 'friend_request',
  FRIEND_CHECKIN: 'friend_checkin',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  LEADERBOARD_UPDATE: 'leaderboard_update',
  WEIGHT_REMINDER: 'weight_reminder',
  STREAK_MILESTONE: 'streak_milestone',
};

// 存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SYNC_TIME: 'last_sync_time',
  CACHED_TASKS: 'cached_tasks',
  NOTIFICATION_PERMISSIONS: 'notification_permissions',
};

// 正则表达式
export const REGEX_PATTERNS = {
  PHONE: /^1[3-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  NICKNAME: /^[a-zA-Z0-9\u4e00-\u9fa5_-]{1,50}$/,
  WEIGHT: /^\d{1,3}(\.\d{1,2})?$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  VALIDATION_ERROR: '输入信息有误，请检查',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  TIMEOUT: '请求超时，请重试',
  UNKNOWN_ERROR: '未知错误，请联系客服',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  TASK_COMPLETED: '任务完成！',
  PROFILE_UPDATED: '资料更新成功',
  WEIGHT_RECORDED: '体重记录成功',
  FRIEND_ADDED: '好友添加成功',
  POST_PUBLISHED: '动态发布成功',
};

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  API_CONFIG,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATION_DURATION,
  APP_CONSTANTS,
  TASK_CATEGORIES,
  TASK_DIFFICULTIES,
  TASK_ICONS,
  GENDER_OPTIONS,
  EXERCISE_LEVELS,
  DIETARY_PREFERENCES,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};


