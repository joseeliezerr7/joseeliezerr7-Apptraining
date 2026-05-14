import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: '404' }} />
      <Screen>
        <View style={styles.container}>
          <View style={styles.iconWrap}>
            <Ionicons name="compass" size={48} color="#fff" />
          </View>
          <Text style={styles.code}>404</Text>
          <Text style={styles.title}>{t('notFound.title')}</Text>
          <Text style={styles.text}>{t('notFound.body')}</Text>
          <Link href="/" asChild>
            <Button label={t('notFound.cta')} fullWidth />
          </Link>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  code: { fontSize: 56, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  title: { ...typography.h2, color: colors.text, textAlign: 'center' },
  text: { color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
});
