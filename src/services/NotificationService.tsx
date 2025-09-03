import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { NOTIFICATION_TYPES } from '@/constants';

interface NotificationContextType {
  requestPermission: () => Promise<boolean>;
  scheduleLocalNotification: (title: string, message: string, date: Date) => void;
  cancelAllNotifications: () => void;
  setBadgeCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  useEffect(() => {
    configureNotifications();
    
    return () => {
      // 清理工作
    };
  }, []);

  const configureNotifications = () => {
    PushNotification.configure({
      // 点击通知时的回调
      onNotification: function (notification) {
        console.log('Notification received:', notification);
        
        // 处理通知点击
        if (notification.userInteraction) {
          handleNotificationPress(notification);
        }

        // iOS需要调用这个方法
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // 注册推送token的回调
      onRegister: function (token) {
        console.log('Push token:', token);
        // 可以将token发送到服务器
      },

      // iOS设置
      requestPermissions: Platform.OS === 'ios',
      
      // Android设置
      senderID: 'YOUR_SENDER_ID', // FCM Sender ID
      
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
    });

    // 创建默认通知渠道（Android）
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'default',
          channelName: '默认通知',
          channelDescription: '应用的默认通知渠道',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`CreateChannel returned '${created}'`)
      );

      PushNotification.createChannel(
        {
          channelId: 'reminder',
          channelName: '提醒通知',
          channelDescription: '任务提醒和打卡提醒',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Reminder channel created: ${created}`)
      );
    }
  };

  const handleNotificationPress = (notification: any) => {
    // 根据通知类型执行不同的操作
    const { type, data } = notification;
    
    switch (type) {
      case NOTIFICATION_TYPES.TASK_REMINDER:
        // 导航到任务页面
        break;
      case NOTIFICATION_TYPES.FRIEND_REQUEST:
        // 导航到好友页面
        break;
      case NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED:
        // 显示成就弹窗
        break;
      default:
        // 默认行为：打开应用主页
        break;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    } else {
      // iOS权限在configure时已经请求
      return true;
    }
  };

  const scheduleLocalNotification = (title: string, message: string, date: Date) => {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      channelId: 'reminder',
      soundName: 'default',
      playSound: true,
      vibrate: true,
      repeatType: 'day', // 可选：重复类型
    });
  };

  const cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  const setBadgeCount = (count: number) => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(count);
    } else {
      // Android需要使用第三方库或原生模块来设置badge
      PushNotification.setApplicationIconBadgeNumber(count);
    }
  };

  // 设置每日提醒
  const scheduleDailyReminder = () => {
    // 清除现有的提醒
    PushNotification.cancelAllLocalNotifications();
    
    // 设置早上9点的提醒
    const reminderTime = new Date();
    reminderTime.setHours(9, 0, 0, 0);
    
    // 如果今天的9点已经过了，设置为明天
    if (reminderTime.getTime() <= Date.now()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      title: '💪 减肥小目标',
      message: '今天的任务等着你呢！坚持就是胜利～',
      date: reminderTime,
      channelId: 'reminder',
      repeatType: 'day',
      playSound: true,
      vibrate: true,
    });
  };

  // 设置晚上提醒
  const scheduleEveningReminder = () => {
    const reminderTime = new Date();
    reminderTime.setHours(20, 0, 0, 0);
    
    if (reminderTime.getTime() <= Date.now()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      title: '🌙 今日总结',
      message: '记得记录今天的体重和完成情况哦！',
      date: reminderTime,
      channelId: 'reminder',
      repeatType: 'day',
      playSound: true,
      vibrate: true,
    });
  };

  const contextValue: NotificationContextType = {
    requestPermission,
    scheduleLocalNotification,
    cancelAllNotifications,
    setBadgeCount,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// 导出通知相关的工具函数
export const NotificationUtils = {
  // 发送本地通知
  sendLocalNotification: (title: string, message: string) => {
    PushNotification.localNotification({
      title,
      message,
      channelId: 'default',
      playSound: true,
      vibrate: true,
    });
  },

  // 发送成就解锁通知
  sendAchievementNotification: (achievementName: string) => {
    PushNotification.localNotification({
      title: '🎉 恭喜解锁新成就！',
      message: `你获得了"${achievementName}"成就！`,
      channelId: 'default',
      playSound: true,
      vibrate: true,
    });
  },

  // 发送连续打卡提醒
  sendStreakNotification: (days: number) => {
    PushNotification.localNotification({
      title: '🔥 连续打卡记录',
      message: `太棒了！你已经连续打卡${days}天了！`,
      channelId: 'default',
      playSound: true,
      vibrate: true,
    });
  },

  // 发送好友活动通知
  sendFriendActivityNotification: (friendName: string, activity: string) => {
    PushNotification.localNotification({
      title: '👥 好友动态',
      message: `${friendName}${activity}`,
      channelId: 'default',
      playSound: true,
      vibrate: true,
    });
  },
};

export default NotificationProvider;


