import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginWithCode, sendVerificationCode, selectAuthLoading, selectAuthError } from '@/store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, REGEX_PATTERNS } from '@/constants';
import { AppDispatch } from '@/store';
import { LoadingScreen } from '@/components/LoadingScreen';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 表单验证
  const validateForm = () => {
    if (!phone.trim()) {
      Alert.alert('提示', '请输入手机号');
      return false;
    }

    if (!REGEX_PATTERNS.PHONE.test(phone)) {
      Alert.alert('提示', '请输入正确的手机号格式');
      return false;
    }

    if (loginMode === 'password') {
      if (!password.trim()) {
        Alert.alert('提示', '请输入密码');
        return false;
      }
    } else {
      if (!verificationCode.trim()) {
        Alert.alert('提示', '请输入验证码');
        return false;
      }
      if (verificationCode.length !== 6) {
        Alert.alert('提示', '验证码应为6位数字');
        return false;
      }
    }

    return true;
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone.trim()) {
      Alert.alert('提示', '请先输入手机号');
      return;
    }

    if (!REGEX_PATTERNS.PHONE.test(phone)) {
      Alert.alert('提示', '请输入正确的手机号格式');
      return;
    }

    try {
      await dispatch(sendVerificationCode(phone)).unwrap();
      setIsCodeSent(true);
      startCountdown();
      Alert.alert('成功', '验证码已发送');
    } catch (error: any) {
      Alert.alert('错误', error.message || '发送验证码失败');
    }
  };

  // 开始倒计时
  const startCountdown = () => {
    let count = 60;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(timer);
        setCountdown(0);
      }
    }, 1000);
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      if (loginMode === 'password') {
        await dispatch(login({ phone, password })).unwrap();
      } else {
        await dispatch(loginWithCode({ phone, verification_code: verificationCode })).unwrap();
      }
      // 登录成功后导航会自动处理
    } catch (error: any) {
      Alert.alert('登录失败', error.message || '请检查输入信息');
    }
  };

  // 处理注册
  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  // 处理忘记密码
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  if (isLoading) {
    return <LoadingScreen message="登录中..." />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录您的账户继续减肥之旅</Text>
        </View>

        <View style={styles.form}>
          {/* 登录方式切换 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, loginMode === 'password' && styles.activeTab]}
              onPress={() => setLoginMode('password')}
            >
              <Text style={[styles.tabText, loginMode === 'password' && styles.activeTabText]}>
                密码登录
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, loginMode === 'code' && styles.activeTab]}
              onPress={() => setLoginMode('code')}
            >
              <Text style={[styles.tabText, loginMode === 'code' && styles.activeTabText]}>
                验证码登录
              </Text>
            </TouchableOpacity>
          </View>

          {/* 手机号输入 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
              placeholderTextColor={COLORS.gray400}
            />
          </View>

          {/* 密码或验证码输入 */}
          {loginMode === 'password' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>密码</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={COLORS.gray400}
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>验证码</Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  placeholder="请输入验证码"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor={COLORS.gray400}
                />
                <TouchableOpacity
                  style={[styles.codeButton, countdown > 0 && styles.codeButtonDisabled]}
                  onPress={handleSendCode}
                  disabled={countdown > 0}
                >
                  <Text style={[styles.codeButtonText, countdown > 0 && styles.codeButtonTextDisabled]}>
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 错误信息 */}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* 登录按钮 */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>登录</Text>
          </TouchableOpacity>

          {/* 忘记密码 */}
          {loginMode === 'password' && (
            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>忘记密码？</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>还没有账户？</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>立即注册</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    marginRight: SPACING.md,
  },
  codeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  codeButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  codeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  codeButtonTextDisabled: {
    color: COLORS.gray500,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.base,
    marginRight: SPACING.xs,
  },
  registerText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default LoginScreen;


