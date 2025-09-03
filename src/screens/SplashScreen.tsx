import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, verifyToken } from '@/store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, ANIMATION_DURATION } from '@/constants';
import { AppDispatch } from '@/store';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // 启动动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.slow,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // 初始化应用
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 验证已存储的token是否有效
      if (isAuthenticated) {
        await dispatch(verifyToken());
      }

      // 等待最少显示时间
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 导航到相应页面
      if (isAuthenticated) {
        navigation.navigate('Main' as never);
      } else {
        navigation.navigate('Auth' as never);
      }
    } catch (error) {
      console.error('App initialization error:', error);
      // 出错时也要导航，防止卡在启动页
      navigation.navigate('Auth' as never);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 应用图标 */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💪</Text>
        </View>
        
        {/* 应用标题 */}
        <Text style={styles.title}>WeightHabit</Text>
        <Text style={styles.subtitle}>减肥习惯养成</Text>
        
        {/* 标语 */}
        <Text style={styles.slogan}>
          每天一小步，健康一大步
        </Text>
      </Animated.View>
      
      {/* 版本信息 */}
      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primaryLight,
    marginBottom: SPACING.xl,
    fontWeight: '500',
  },
  slogan: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primaryLight,
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    alignItems: 'center',
  },
  version: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryLight,
    opacity: 0.7,
  },
});

export default SplashScreen;


