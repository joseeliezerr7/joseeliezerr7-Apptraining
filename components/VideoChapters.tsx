import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { Chapter } from '@/lib/supabase';
import { formatDuration } from '@/lib/format';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';

type Props = {
  chapters: Chapter[];
  currentSeconds?: number;
  onSeek: (seconds: number) => void;
};

export function VideoChapters({ chapters, currentSeconds = 0, onSeek }: Props) {
  const { t, i18n } = useTranslation();
  const sorted = [...chapters].sort((a, b) => a.start_seconds - b.start_seconds);

  function activeIndex(): number {
    let idx = -1;
    for (let i = 0; i < sorted.length; i++) {
      if (currentSeconds >= sorted[i]!.start_seconds) idx = i;
      else break;
    }
    return idx;
  }

  const active = activeIndex();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('videos.chapters')}</Text>
      <View style={{ gap: spacing.xs }}>
        {sorted.map((c, i) => {
          const isActive = i === active;
          return (
            <Pressable
              key={i}
              onPress={() => onSeek(c.start_seconds)}
              style={({ pressed }) => [
                styles.row,
                isActive && styles.rowActive,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View
                style={[styles.timeChip, isActive && styles.timeChipActive]}
              >
                <Text
                  style={[
                    styles.time,
                    isActive && { color: '#fff' },
                  ]}
                >
                  {formatDuration(c.start_seconds)}
                </Text>
              </View>
              <Text
                numberOfLines={2}
                style={[styles.chapterText, isActive && styles.chapterTextActive]}
              >
                {i18n.language === 'es' ? c.title_es : c.title_en}
              </Text>
              {isActive ? (
                <Ionicons name="play" size={14} color={colors.primary} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadow.card,
  },
  title: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  rowActive: {
    backgroundColor: colors.bgElevated,
  },
  timeChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    minWidth: 56,
    alignItems: 'center',
  },
  timeChipActive: { backgroundColor: colors.primary },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
  },
  chapterText: { flex: 1, color: colors.text, fontSize: 14 },
  chapterTextActive: { color: colors.text, fontWeight: '700' },
});
