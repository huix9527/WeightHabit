import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import authSlice from './slices/authSlice';
import taskSlice from './slices/taskSlice';
import checkinSlice from './slices/checkinSlice';
import socialSlice from './slices/socialSlice';
import uiSlice from './slices/uiSlice';

// 持久化配置
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // 只持久化认证状态
  blacklist: ['ui'], // 不持久化UI状态
};

// 认证状态持久化配置
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['user', 'token', 'isAuthenticated'],
};

// 合并所有reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  tasks: taskSlice,
  checkin: checkinSlice,
  social: socialSlice,
  ui: uiSlice,
});

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }),
  devTools: __DEV__,
});

// 创建persistor
export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 重置store数据的action
export const resetStore = () => {
  persistor.purge();
  return { type: 'RESET_STORE' };
};

export default store;


