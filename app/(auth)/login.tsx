import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/lib/auth';
import { SUPABASE_CONFIGURED } from '@/lib/supabase';
import { isAppleAvailable, signInWithApple, signInWithGoogle } from '@/lib/oauth';
import { colors, spacing, typography } from '@/constants/theme';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; root?: string }>({});
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<null | 'apple' | 'google'>(null);

  async function onApple() {
    setOauthLoading('apple');
    try {
      await signInWithApple();
      router.replace('/(app)');
    } catch (err: any) {
      if (err?.code !== 'ERR_REQUEST_CANCELED') {
        toast.error(err?.message ?? 'Apple sign-in failed');
      }
    } finally {
      setOauthLoading(null);
    }
  }

  async function onGoogle() {
    setOauthLoading('google');
    try {
      await signInWithGoogle();
      router.replace('/(app)');
    } catch (err: any) {
      toast.error(err?.message ?? 'Google sign-in failed');
    } finally {
      setOauthLoading(null);
    }
  }

  async function onSubmit() {
    setErrors({});
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((i) => {
        const field = i.path[0] as 'email' | 'password';
        if (field === 'email') fieldErrors.email = t('auth.errors.emailInvalid');
        if (field === 'password')
          fieldErrors.password = t('auth.errors.passwordShort');
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace('/(app)');
    } catch (err: any) {
      setErrors({ root: err?.message ?? 'Sign-in failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="play-circle" size={32} color="#fff" />
            </View>
            <Text style={styles.brandText}>{t('common.appName')}</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>{t('auth.loginHero')}</Text>
            <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('auth.email')}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <Input
              label={t('auth.password')}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              rightSlot={
                <Pressable onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              }
            />

            {errors.root ? (
              <Text style={styles.error}>{errors.root}</Text>
            ) : null}

            <Button
              label={t('auth.loginCta')}
              onPress={onSubmit}
              loading={loading}
              fullWidth
            />

            <Link href="/(auth)/forgot-password" asChild>
              <Pressable style={styles.forgotLink}>
                <Text style={styles.forgotLinkText}>{t('auth.forgotLink')}</Text>
              </Pressable>
            </Link>
          </View>

          {SUPABASE_CONFIGURED ? (
            <View style={styles.oauth}>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
                <View style={styles.divider} />
              </View>
              {(isAppleAvailable || Platform.OS === 'web') ? (
                <Button
                  label={t('auth.signInWithApple')}
                  variant="secondary"
                  onPress={onApple}
                  loading={oauthLoading === 'apple'}
                  fullWidth
                />
              ) : null}
              <Button
                label={t('auth.signInWithGoogle')}
                variant="secondary"
                onPress={onGoogle}
                loading={oauthLoading === 'google'}
                fullWidth
              />
            </View>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.noAccount')}</Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={styles.link}>{t('auth.signUp')}</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  brand: { alignItems: 'center', gap: spacing.md },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { ...typography.h3, color: colors.text },
  hero: { alignItems: 'center', gap: spacing.xs },
  title: { ...typography.h1, color: colors.text },
  subtitle: { color: colors.textMuted, fontSize: 15, textAlign: 'center' },
  form: { gap: spacing.lg },
  error: { color: colors.danger, ...typography.caption },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footerText: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '700' },
  forgotLink: { alignSelf: 'center', padding: spacing.sm },
  forgotLinkText: { color: colors.textMuted, fontWeight: '600' },
  oauth: { gap: spacing.md },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, ...typography.caption },
});
