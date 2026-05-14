import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import type { Manual } from '@/lib/supabase';

export function ManualCard({ manual }: { manual: Manual }) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language as 'en' | 'es';
  const title = lang === 'es' ? manual.title_es : manual.title_en;
  const availableLangs = [
    manual.pdf_url_en ? 'EN' : null,
    manual.pdf_url_es ? 'ES' : null,
  ].filter(Boolean) as string[];

  return (
    <Link href={`/manuals/${manual.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.thumb}>
          <Image
            source={manual.thumbnail_url}
            contentFit="cover"
            transition={200}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.pdfBadge}>
            <Ionicons name="document-text" size={12} color="#fff" />
            <Text style={styles.pdfText}>PDF</Text>
          </View>
        </View>
        <View style={styles.body}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.langs}>
              {availableLangs.map((l) => (
                <View key={l} style={styles.langBadge}>
                  <Text style={styles.langText}>{l}</Text>
                </View>
              ))}
            </View>
            {manual.page_count ? (
              <Text style={styles.meta}>
                {manual.page_count} {t('manuals.pages')}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  thumb: {
    width: 80,
    height: 110,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    ...shadow.card,
  },
  pdfBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  pdfText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  body: { flex: 1, gap: spacing.sm, justifyContent: 'space-between' },
  title: { ...typography.bodyBold, color: colors.text, fontSize: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  langs: { flexDirection: 'row', gap: spacing.xs },
  langBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: { ...typography.caption, color: colors.textMuted, fontWeight: '700' },
  meta: { ...typography.caption, color: colors.textMuted },
});
