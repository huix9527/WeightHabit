import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '@/store/slices/authSlice';
import { LoadingScreen } from '@/components/LoadingScreen';
import { RootStackParamList } from '@/types';

// 导入屏幕组件
import SplashScreen from '@/screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  // 如果正在加载，显示加载屏幕
  if (isLoading) {
    return <LoadingScreen message="初始化中..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="Splash"
    >
      {/* 启动屏幕 */}
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      {/* 根据认证状态显示不同的导航器 */}
      {isAuthenticated ? (
        <Stack.Screen 
          name="Main" 
          component={MainNavigator}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;


