import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

const HomeScreen: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <ScrollView style={styles.container}>
      {/* 欢迎区域 */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Hi, {user?.nickname || '用户'}!</Text>
        <Text style={styles.subtitle}>今天也要加油哦 💪</Text>
      </View>

      {/* 今日概览 */}
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>今日概览</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0/3</Text>
            <Text style={styles.statLabel}>已完成任务</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>连续打卡</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>本周积分</Text>
          </View>
        </View>
      </View>

      {/* 快捷操作 */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionText}>选择任务</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>⚖️</Text>
            <Text style={styles.actionText}>记录体重</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>查看统计</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>好友动态</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 今日任务预览 */}
      <View style={styles.taskSection}>
        <Text style={styles.sectionTitle}>今日任务</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>暂无任务，点击"选择任务"开始</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  greeting: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primaryLight,
  },
  overviewSection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    textAlign: 'center',
  },
  actionSection: {
    padding: SPACING.lg,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: FONT_SIZES['2xl'],
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  taskSection: {
    padding: SPACING.lg,
  },
  placeholder: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;


