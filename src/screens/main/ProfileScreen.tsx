import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '@/store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';
import { AppDispatch } from '@/store';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息区域 */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nickname?.charAt(0)?.toUpperCase() || '用'}
          </Text>
        </View>
        <Text style={styles.nickname}>{user?.nickname || '用户昵称'}</Text>
        <Text style={styles.phone}>{user?.phone || '未绑定手机'}</Text>
      </View>

      {/* 统计信息 */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>连续打卡</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>累计积分</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>好友数量</Text>
        </View>
      </View>

      {/* 功能菜单 */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>数据统计</Text>
          <Text style={styles.menuArrow}>></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🏆</Text>
          <Text style={styles.menuText}>我的成就</Text>
          <Text style={styles.menuArrow}>></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚖️</Text>
          <Text style={styles.menuText}>体重记录</Text>
          <Text style={styles.menuArrow}>></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>设置</Text>
          <Text style={styles.menuArrow}>></Text>
        </TouchableOpacity>
      </View>

      {/* 退出登录 */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileSection: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.white,
    fontWeight: 'bold',
  },
  nickname: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  phone: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.md,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray400,
  },
  logoutSection: {
    padding: SPACING.lg,
    marginTop: SPACING.sm,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default ProfileScreen;


