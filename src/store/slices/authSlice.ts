import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, ApiResponse } from '@/types';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { STORAGE_KEYS } from '@/constants';

// 初始状态
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// 异步actions

// 用户登录
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { phone?: string; email?: string; password?: string; verification_code?: string }) => {
    const response = await authService.login(credentials);
    
    // 保存token到本地存储
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    
    return response.data;
  }
);

// 用户注册
export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
    phone?: string;
    email?: string;
    nickname: string;
    password?: string;
    gender?: string;
    age?: number;
    current_weight?: number;
    target_weight?: number;
  }) => {
    const response = await authService.register(userData);
    
    // 保存token到本地存储
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    
    return response.data;
  }
);

// 验证码登录
export const loginWithCode = createAsyncThunk(
  'auth/loginWithCode',
  async (data: { phone: string; verification_code: string }) => {
    const response = await authService.loginWithCode(data);
    
    // 保存token到本地存储
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    
    return response.data;
  }
);

// 发送验证码
export const sendVerificationCode = createAsyncThunk(
  'auth/sendVerificationCode',
  async (phone: string) => {
    const response = await authService.sendVerificationCode(phone);
    return response.data;
  }
);

// 微信登录
export const loginWithWechat = createAsyncThunk(
  'auth/loginWithWechat',
  async (wechatCode: string) => {
    const response = await authService.loginWithWechat(wechatCode);
    
    // 保存token到本地存储
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    
    return response.data;
  }
);

// Apple登录
export const loginWithApple = createAsyncThunk(
  'auth/loginWithApple',
  async (identityToken: string) => {
    const response = await authService.loginWithApple(identityToken);
    
    // 保存token到本地存储
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    
    return response.data;
  }
);

// 刷新token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (!state.auth.token) {
      throw new Error('No token to refresh');
    }
    
    const response = await authService.refreshToken();
    
    // 更新token
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    
    return response.data;
  }
);

// 退出登录
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authService.logout();
    } catch (error) {
      // 即使后端退出失败，也要清除本地数据
    }
    
    // 清除本地存储
    await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storageService.removeItem(STORAGE_KEYS.USER_DATA);
  }
);

// 重置密码
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { phone: string; verification_code: string; new_password: string }) => {
    const response = await authService.resetPassword(data);
    return response.data;
  }
);

// 验证token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (!state.auth.token) {
      throw new Error('No token to verify');
    }
    
    const response = await authService.verifyToken();
    return response.data;
  }
);

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置loading状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // 更新用户信息
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // 同步更新本地存储
        storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      }
    },
    
    // 设置token
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    
    // 手动退出登录（不调用API）
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // 清除本地存储
      storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      storageService.removeItem(STORAGE_KEYS.USER_DATA);
    },
  },
  extraReducers: (builder) => {
    // 登录
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '登录失败';
      });

    // 注册
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '注册失败';
      });

    // 验证码登录
    builder
      .addCase(loginWithCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '验证码登录失败';
      });

    // 发送验证码
    builder
      .addCase(sendVerificationCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '发送验证码失败';
      });

    // 微信登录
    builder
      .addCase(loginWithWechat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithWechat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithWechat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '微信登录失败';
      });

    // Apple登录
    builder
      .addCase(loginWithApple.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithApple.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithApple.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Apple登录失败';
      });

    // 刷新token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        // token刷新失败，退出登录
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        storageService.removeItem(STORAGE_KEYS.USER_DATA);
      });

    // 退出登录
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // 重置密码
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '重置密码失败';
      });

    // 验证token
    builder
      .addCase(verifyToken.fulfilled, (state, action) => {
        if (action.payload.valid) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// 导出actions
export const { 
  clearError, 
  setLoading, 
  updateUser, 
  setToken, 
  logoutLocal 
} = authSlice.actions;

// 导出selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;


