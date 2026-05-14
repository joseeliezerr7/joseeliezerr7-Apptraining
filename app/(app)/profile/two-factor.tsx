import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';
import { supabase, SUPABASE_CONFIGURED } from '@/lib/supabase';
import { colors, radius, spacing, typography } from '@/constants/theme';

type Factor = { id: string; status: 'verified' | 'unverified' };

export default function TwoFactorScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState<Factor[]>([]);
  const [enrolling, setEnrolling] = useState<null | {
    id: string;
    qr: string;
    secret: string;
  }>(null);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const refresh = useCallback(async () => {
    if (!SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const totps = (data.totp ?? []).map((f) => ({
      id: f.id,
      status: f.status as 'verified' | 'unverified',
    }));
    setEnrolled(totps);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function startEnroll() {
    if (!SUPABASE_CONFIGURED) {
      toast.error('Connect Supabase to enable 2FA');
      return;
    }
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) {
      toast.error(error.message);
      return;
    }
    setEnrolling({
      id: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }

  async function verifyEnroll() {
    if (!enrolling) return;
    setVerifying(true);
    try {
      const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({
        factorId: enrolling.id,
      });
      if (cErr) throw cErr;
      const { error: vErr } = await supabase.auth.mfa.verify({
        factorId: enrolling.id,
        challengeId: challenge.id,
        code,
      });
      if (vErr) throw vErr;
      toast.success(t('auth.twoFactorEnabled'));
      setEnrolling(null);
      setCode('');
      await refresh();
    } catch (err: any) {
      toast.error(err?.message ?? 'Verify failed');
    } finally {
      setVerifying(false);
    }
  }

  async function disable(factorId: string) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) toast.error(error.message);
    else {
      toast.success(t('common.save'));
      await refresh();
    }
  }

  const active = enrolled.find((f) => f.status === 'verified');

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="chevron-back" size={26} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>{t('auth.twoFactor')}</Text>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : !SUPABASE_CONFIGURED ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                Two-factor authentication requires Supabase to be configured.
              </Text>
            </View>
          ) : active && !enrolling ? (
            <>
              <View style={styles.successBox}>
                <Ionicons name="shield-checkmark" size={28} color={colors.success} />
                <Text style={styles.successText}>{t('auth.twoFactorEnabled')}</Text>
              </View>
              <Button
                label={t('auth.twoFactorDisable')}
                variant="secondary"
                onPress={() => disable(active.id)}
                fullWidth
              />
            </>
          ) : enrolling ? (
            <View style={styles.form}>
              <Text style={styles.helpText}>{t('auth.twoFactorScan')}</Text>
              <View style={styles.qrWrap}>
                <Image
                  source={{ uri: enrolling.qr }}
                  style={styles.qr}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.secretRow}>
                <Text style={styles.secretLabel}>Secret</Text>
                <Text selectable style={styles.secret}>
                  {enrolling.secret}
                </Text>
              </View>
              <Input
                label={t('auth.twoFactorCode')}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <Button
                label={t('auth.twoFactorVerify')}
                onPress={verifyEnroll}
                loading={verifying}
                fullWidth
              />
              <Button
                label={t('common.cancel')}
                variant="ghost"
                onPress={() => {
                  setEnrolling(null);
                  setCode('');
                }}
                fullWidth
              />
            </View>
          ) : (
            <Button label={t('auth.twoFactorEnable')} onPress={startEnroll} fullWidth />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { ...typography.h2, color: colors.text },
  notice: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeText: { color: colors.textMuted, lineHeight: 22 },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.4)',
  },
  successText: { flex: 1, color: colors.text, ...typography.bodyBold },
  form: { gap: spacing.lg },
  helpText: { color: colors.textMuted, lineHeight: 22 },
  qrWrap: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: radius.md,
  },
  qr: { width: 200, height: 200 },
  secretRow: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  secretLabel: { color: colors.textMuted, ...typography.caption },
  secret: { color: colors.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
