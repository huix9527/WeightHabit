import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT_SIZES } from '@/constants';
import { TabParamList, RootStackParamList } from '@/types';

// 导入主要屏幕
import HomeScreen from '@/screens/main/HomeScreen';
import TasksScreen from '@/screens/main/TasksScreen';
import SocialScreen from '@/screens/main/SocialScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';

// 导入其他屏幕
import TaskDetailScreen from '@/screens/TaskDetailScreen';
import WeightRecordScreen from '@/screens/WeightRecordScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AchievementsScreen from '@/screens/AchievementsScreen';
import FriendsScreen from '@/screens/FriendsScreen';
import LeaderboardScreen from '@/screens/LeaderboardScreen';
import PostDetailScreen from '@/screens/PostDetailScreen';
import CreatePostScreen from '@/screens/CreatePostScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// 标签页导航器
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Tasks':
              iconName = 'assignment';
              break;
            case 'Social':
              iconName = 'people';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
        }}
      />
      
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen}
        options={{
          tabBarLabel: '任务',
        }}
      />
      
      <Tab.Screen 
        name="Social" 
        component={SocialScreen}
        options={{
          tabBarLabel: '社交',
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
        }}
      />
    </Tab.Navigator>
  );
};

// 主导航器
export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontSize: FONT_SIZES.lg,
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
        gestureEnabled: true,
      }}
    >
      {/* 主标签页 */}
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      
      {/* 其他屏幕 */}
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen}
        options={{
          title: '任务详情',
          presentation: 'modal',
        }}
      />
      
      <Stack.Screen 
        name="WeightRecord" 
        component={WeightRecordScreen}
        options={{
          title: '记录体重',
          presentation: 'modal',
        }}
      />
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: '设置',
        }}
      />
      
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{
          title: '我的成就',
        }}
      />
      
      <Stack.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{
          title: '我的好友',
        }}
      />
      
      <Stack.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{
          title: '排行榜',
        }}
      />
      
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
        options={{
          title: '动态详情',
        }}
      />
      
      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen}
        options={{
          title: '发布动态',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;


