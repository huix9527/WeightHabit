// 用户相关类型
export interface User {
  id: string;
  phone?: string;
  email?: string;
  nickname: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  current_weight?: number;
  target_weight?: number;
  target_date?: string;
  exercise_level?: 'none' | 'light' | 'medium' | 'heavy';
  dietary_preferences?: string[];
  sleep_time?: string;
  wake_time?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_checkins: number;
  current_streak: number;
  max_streak: number;
  total_tasks_completed: number;
  total_points: number;
  weight_loss: number;
  achievements_count: number;
  friends_count: number;
}

// 任务相关类型
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'diet' | 'exercise' | 'lifestyle';
  difficulty: 'easy' | 'medium' | 'hard';
  duration_minutes?: number;
  calories?: number;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  task_id: string;
  task?: Task;
  date: string;
  is_selected: boolean;
  is_completed: boolean;
  completed_at?: string;
  note?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskSelectionData {
  tasks: DailyTask[];
  date: string;
  selected_count: number;
}

// 打卡相关类型
export interface CheckIn {
  id: string;
  user_id: string;
  date: string;
  tasks_completed: number;
  tasks_selected: number;
  streak_days: number;
  points_earned: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface CheckInStats {
  total_checkins: number;
  current_streak: number;
  max_streak: number;
  total_points: number;
  avg_completion_rate: string;
  perfect_days: number;
  monthly: {
    monthly_checkins: number;
    monthly_points: number;
    monthly_perfect_days: number;
  };
}

// 体重记录类型
export interface WeightRecord {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  note?: string;
  created_at: string;
  weight_change?: number;
}

// 社交相关类型
export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  friend?: User;
  status: 'pending' | 'accepted' | 'blocked';
  requested_by: string;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  user?: User;
  period_type: 'daily' | 'weekly' | 'monthly';
  period_date: string;
  points: number;
  rank?: number;
  tasks_completed: number;
  streak_days: number;
  created_at: string;
  updated_at: string;
}

// 成就相关类型
export interface Achievement {
  id: string;
  name: string;
  description?: string;
  badge_icon?: string;
  condition_type: 'streak' | 'total_tasks' | 'weight_loss' | 'social';
  condition_value: number;
  points_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement?: Achievement;
  achieved_at: string;
}

// 动态相关类型
export interface Post {
  id: string;
  user_id: string;
  user?: User;
  content: string;
  images?: string[];
  post_type: 'checkin' | 'experience' | 'recipe' | 'exercise';
  likes_count: number;
  comments_count: number;
  is_public: boolean;
  is_liked?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user?: User;
  post_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 通知类型
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content?: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// 导航类型
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  TaskDetail: { task: Task };
  WeightRecord: undefined;
  Profile: undefined;
  Settings: undefined;
  Achievements: undefined;
  Friends: undefined;
  Leaderboard: undefined;
  PostDetail: { post: Post };
  CreatePost: undefined;
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Social: undefined;
  Profile: undefined;
};

// Redux状态类型
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TaskState {
  dailyTasks: DailyTask[];
  taskLibrary: Task[];
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}

export interface CheckInState {
  records: CheckIn[];
  stats: CheckInStats | null;
  isLoading: boolean;
  error: string | null;
}

export interface SocialState {
  friends: Friend[];
  leaderboard: LeaderboardEntry[];
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  tasks: TaskState;
  checkin: CheckInState;
  social: SocialState;
}

// 表单验证类型
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
}

// 设置类型
export interface AppSettings {
  notifications: {
    push: boolean;
    email: boolean;
    daily_reminder: boolean;
    friend_activity: boolean;
    achievements: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'friends' | 'private';
    activity_visibility: 'public' | 'friends' | 'private';
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
    primary_color: string;
  };
  language: string;
}

// 错误类型
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export default {};


