import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

interface LoadingScreenProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = '加载中...', 
  size = 'large' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size={size} 
        color={COLORS.primary} 
        style={styles.indicator}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  indicator: {
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingScreen;


